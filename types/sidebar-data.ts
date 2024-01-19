
import { Chat, Preset } from "@prisma/client"
export type DataListType =
| Chat[]
| Preset[]
// | Tables<"collections">[]
//   | Tables<"prompts">[]
//   | Tables<"files">[]
//   | Tables<"assistants">[]

export type DataItemType =
| Chat
| Preset
// | Tables<"collections">
//   | Tables<"prompts">
//   | Tables<"files">
//   | Tables<"assistants">