import * as z from "zod"

export type TabType =
  | "chats"
  | "presets"
  | "prompts"
export const searchParamsSchema = z.object({
  tab: z.enum(["chats", "presets", "prompts"]).optional(),
});