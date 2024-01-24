import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Message } from "@prisma/client";
import { formatMessage } from "@/lib/utils";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const chatModel = new ChatOllama({
      baseUrl: `${process.env.NEXT_PUBLIC_OLLAMA_URL}`,
      model: "phi:latest",
    });
    const messagesd = [
    { role: "user", content: "Hello, how are you?" },
    { role: "assistant", content: "I'm doing well, thank you!" },
    { role: "user", content: "what your name?" }
    ];
    console.log(messages)
    const outputParser = new StringOutputParser();
    // Use the template in the ChatPromptTemplate
    const prompt = ChatPromptTemplate.fromMessages(
        messages.map((message) => [
          message.role === "user" ? "human" : (message.role === "assistant" ? "ai" : message.role),
          message.content,
        ])
      );
    const chain = prompt.pipe(chatModel).pipe(outputParser);


    const stream = await chain.stream({ input: {}, options: {} })
    
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
