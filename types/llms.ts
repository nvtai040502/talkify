export type ModelProvider =
  | "ollama"
  | "hf"
  export type LLMID =
  | HfLLMID

  export type HfLLMID =
  | "mistralai/Mixtral-8x7B-v0.1"

  export interface LLM {
    modelId: LLMID
    modelName: string
    provider: ModelProvider
    hostedId: string
    platformLink: string
    imageInput: boolean
  }