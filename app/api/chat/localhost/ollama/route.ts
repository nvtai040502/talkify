import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Message } from "@prisma/client";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const {message}:{message: Message} = await req.json()
    const chatModel = new ChatOllama({
      baseUrl: `${process.env.NEXT_PUBLIC_OLLAMA_URL}`, 
      model: "phi:latest",
      format: "json",
    })

    // const outputParser = new StringOutputParser();
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an expert translator. Format all responses as JSON objects with two keys: "original" and "translated".`,
      ],
      ["user", `Translate "{input}" into {language}.`],
    ]);
    const chain = prompt.pipe(chatModel);
    const stream = await chain.stream({
      input: "I love programming",
      language: "Vietnamese",
    });
    // const stream = await chatModel.stream(message);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}