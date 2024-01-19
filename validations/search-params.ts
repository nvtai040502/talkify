import * as z from "zod"

export type TabType =
  | "chats"
  | "presets"
export const searchParamsSchema = z.object({
  tab: z.enum(["chats", "presets"]).optional(),
});