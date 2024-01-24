import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a world class technical documentation writer."],
  ["user", "{input}"],
]);


const TestPage = async () => {
const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: "phi:latest", // Default value
});
const outputParser = new StringOutputParser();
const chain = prompt.pipe(model).pipe(outputParser);

const stream = await chain.stream({
  input: "hello?",
});
const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(chunk)
}


console.log(chunks.join(""));

  return (
    <div></div>
  )
}
export default TestPage