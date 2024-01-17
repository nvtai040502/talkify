import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse } from "ai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Message as PrismaMessage } from "@prisma/client";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"


export const runtime = "edge";

const formatMessage = (message: PrismaMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are a world class technical documentation writer.

Current conversation:
{chat_history}

User: {input}
AI:`;
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    // const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    // const currentMessageContent = messages[messages.length - 1].content;
    // // const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    // const prompt = ChatPromptTemplate.fromMessages([
    //   ["system", "You are a world class technical documentation writer."],
    //   ["user", "{input}"],
    // ]);
    const model = new HuggingFaceInference({
      model: "gpt2",
      apiKey: `${process.env.HUGGINGFACE_API_KEY}`, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
    });
    // const embeddings = new HuggingFaceInferenceEmbeddings()
    
    // const outputParser = new StringOutputParser();
    // const llmChain = prompt.pipe(model).pipe(outputParser);

    const res = await model.stream("hello");
    // const res  = await llmChain.invoke({
    //   chat_history: formattedPreviousMessages,
    //   input: currentMessageContent
    // });

    return new Response(res, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (e: any) {
    console.log(e)
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}