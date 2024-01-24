import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { NextRequest, NextResponse } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Message } from "@prisma/client";
import { formatMessage } from "@/lib/utils";

export const runtime = "edge";
const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const {messages}:{messages: Message[]} = await req.json()
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    console.log(messages)
    const chatModel = new ChatOllama({
      baseUrl: `${process.env.NEXT_PUBLIC_OLLAMA_URL}`, 
      model: "phi:latest",
    })

    const outputParser = new StringOutputParser();
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    console.log(prompt)
    const chain = prompt.pipe(chatModel).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
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