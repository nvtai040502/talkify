export type ModelProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "mistral"
  | "llama"
  | "perplexity"
  | "ollama"

export type LLMID = 
| "hf"
  export interface LLM {
    modelId: LLMID
    modelName: string
    provider: ModelProvider
    hostedId: string
    platformLink: string
    imageInput: boolean
  }