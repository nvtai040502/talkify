import { db } from '@/lib/db';
import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, Message, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages, id } = await req.json();

    const existingChat = await db.chat.findUnique({
      where: { id: id },
    });

    const response = Hf.textGenerationStream({
      model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
      inputs: experimental_buildOpenAssistantPrompt(messages),
      parameters: {
        max_new_tokens: 200,
        // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
        typical_p: 0.2,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    const stream = HuggingFaceStream(response, {
      async onCompletion(completion) {
        if (existingChat) {
          console.log("🚀 ~ onCompletion ~ existingChat:", messages)
          // If the chat exists, update its messages
          await db.message.create({
            data: {
              content: completion,
              role: "assistant",
              chatId: id,
            },
          });
        } else {
          console.log("1")
          // If the chat doesn't exist, create a new chat with messages
          const name = messages[0].content.substring(0, 100);
          const allMessages = messages.map((message: Message) => ({ ...message, chatId: id }));

          await db.chat.create({
            data: { id: id, name: name, path: `/chat/${id}` },
          });

          await db.message.createMany({
            data: [...allMessages, { content: completion, role: "assistant", chatId: id }],
          });
        }
      },
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in POST:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
