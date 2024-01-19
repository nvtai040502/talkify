import { LLM } from "@/types/llms"

const HF_PLATORM_LINK =
  "https://huggingface.co"

const MIXTRAL_8x7B: LLM = {
  modelId: "mistralai/Mixtral-8x7B-v0.1",
  modelName: "Mixtral-8x7B",
  provider: "hf",
  hostedId: "hf",
  platformLink: HF_PLATORM_LINK,
  imageInput: false
}



export const HF_LLM_LIST: LLM[] = [MIXTRAL_8x7B]