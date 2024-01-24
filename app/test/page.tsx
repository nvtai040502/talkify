import { db } from "@/lib/db";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";



const TestPage = async () => {
  const a = await db.chat.findMany()

  return (
    <div></div>
  )
}
export default TestPage