import { NextRequest, NextResponse } from "next/server";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { Message } from "@prisma/client";
import { formatMessage } from "@/lib/utils";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
export const runtime = "edge";
const TEMPLATE = `You are a pirate named Patchy. All responses must be extremely verbose and in pirate dialect.

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const {messages} : {messages: Message[]} = await req.json();
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    const outputParser = new HttpResponseOutputParser();
    const loader = new CheerioWebBaseLoader(
      "https://docs.smith.langchain.com/overview"
    );
   
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter();

    const splitDocs = await splitter.splitDocuments(docs);
    const modelName = "mistralai/Mixtral-8x7B-Instruct-v0.1"
    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: modelName,
      maxConcurrency: 5,
    });
    
    const vectorstore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );
    const retriever = vectorstore.asRetriever();

    const model = new HuggingFaceInference({
      model: modelName,
      apiKey: `${process.env.HUGGINGFACE_API_KEY}`,
    });
    const chain = prompt.pipe(model).pipe(outputParser);
    const documentChain = await createStuffDocumentsChain({
      llm: model,
      prompt,
    });
    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });
    const res = await chain.invoke({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

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