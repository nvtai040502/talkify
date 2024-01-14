import { db } from '@/lib/db';
import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, Message as VercelMessage, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
import { v4 as uuidV4 } from 'uuid';

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    const { messages, chatId }: { messages: VercelMessage[], chatId: string } = await req.json();
    const existingChat = await db.chat.findUnique({ where: { id: chatId } });

    const response = Hf.textGenerationStream({
      model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
      inputs: experimental_buildOpenAssistantPrompt(messages),
      parameters: {
        max_new_tokens: 200,
        repetition_penalty: 1,
        truncate: 1000,
        return_full_text: false,
      },
    });

    const stream = HuggingFaceStream(response, {
      async onCompletion(completion) {
        if (existingChat) {
          const userLastMessage = messages[messages.length - 1];
          const existMessage = await db.message.findUnique({ where: { id: userLastMessage.id } });

          if (existMessage) {
            await db.message.create({
              data: {
                content: completion,
                role: "assistant",
                chatId,
              },
            });
          } else {
            await db.message.createMany({
              data: [
                { id: userLastMessage.id, content: userLastMessage.content, role: userLastMessage.role, chatId },
                { content: completion, role: "assistant", chatId },
              ],
            });
          }
        } else {
          const name = messages[0].content.substring(0, 100);
          const allMessages = messages.map((message: VercelMessage) => ({
            id: message.id,
            content: message.content,
            role: message.role,
            chatId,
          }));

          await db.chat.create({
            data: { id: chatId, name, path: `/chat/${chatId}` },
          });

          await db.message.createMany({
            data: [...allMessages, { content: completion, role: "assistant", chatId }],
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
