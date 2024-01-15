import { db } from '@/lib/db';
import { HfInference } from '@huggingface/inference';
import { Message } from '@prisma/client';

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
export const runtime = "edge"
export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json as {
    messages: Message[]
  }
  try {
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const output of Hf.textGenerationStream({
            model: "google/flan-t5-xxl",
            inputs: messages[0].content,
            parameters: { max_new_tokens: 250 }
          }))  {
            console.log(output.token.text, output.generated_text);

            const messageContent = output.generated_text;
            controller.enqueue(new TextEncoder().encode(messageContent + '\n'));
          }

          // Signal the end of the response
          controller.close();
        } catch (error) {
          console.error('Error in text generation stream:', error);
          controller.error(error);
        }
      }
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error: any) {
    const errorMessage = error.error?.message || 'An unexpected error occurred';
    const errorCode = error.status || 500;
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    });
  }
}
