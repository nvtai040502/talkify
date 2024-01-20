
import { Chat, Preset, Prompt } from "@prisma/client"
export type DataListType =
| Chat[]
| Preset[]
| Prompt[]

export type DataItemType =
| Chat
| Preset
| Prompt