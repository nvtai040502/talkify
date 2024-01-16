import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StreamingTextResponse } from "ai";
// export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const {message}:{message: string} = await req.json()
    const chatModel = new ChatOllama({
      baseUrl: `${process.env.NEXT_PUBLIC_OLLAMA_URL}`, 
      model: "phi",
    })
    const outputParser = new StringOutputParser();
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a world class technical documentation writer."],
      ["user", "{input}"],
    ]);
    const llmChain = prompt.pipe(chatModel).pipe(outputParser);
    const stream = await llmChain.stream({
      input: message,
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}