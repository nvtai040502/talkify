import * as z from "zod"

export const createPresetSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  model: z.string(),
  
  description: z.string(),
  includeWorkspaceInstructions: z.boolean(),
  prompt: z.string(),
  temperature: z.number()
})

export const updatePresetSchema = z.object({
  id: z.string(),
  
  name: z.string().optional(),
  model: z.string().optional(),
  workspaceId: z.string().optional(),
  description: z.string().optional(),
  includeWorkspaceInstructions: z.boolean().optional(),
  prompt: z.string().optional(),
  temperature: z.number().optional()
})