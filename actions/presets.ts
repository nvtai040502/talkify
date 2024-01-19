"use server"
import { db } from "@/lib/db"
import { createPresetSchema, updatePresetSchema } from "@/validations/preset"
import { Preset } from "@prisma/client"

export async function getPresetWorkspacesByWorkspaceId (workspaceId: string) {
  const presetData = await db.preset.findMany({
    where: {
      workspaceId
    }
  })
  return presetData
} 
export async function getPresetWorkspacesByPresetId (presetId: string) {
  const preset = await db.preset.findUnique({
    where: {
      id: presetId
    }
  })
  return preset
}
export async function updatePreset({
  description,
  includeWorkspaceInstructions,
  name,
  model,
  prompt,
  temperature,
  workspaceId,
  id
}: Pick<Preset,| "id" | "description" | "includeWorkspaceInstructions" | "model" | "name" | "prompt" | "temperature" | "workspaceId">) {
  try {
    const preset = db.preset.update({
      where: {
        id
      },
      data: {
        description,
        includeWorkspaceInstructions,
        name,
        model,
        prompt,
        temperature,
        workspaceId,
      }
    })
    return preset
  } catch(e) {
    console.log("🚀 ~ createPreset ~ e:", e)
  } 
}

export async function createPreset(rawInput: Zod.infer<typeof createPresetSchema>) {
  try {
    const input = createPresetSchema.parse(rawInput)
    const preset = db.preset.create({
      data: {
        ...input
      }
    })
    return preset
  } catch(e) {
    console.log("🚀 ~ createPreset ~ e:", e)
  } 
};