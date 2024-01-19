"use server"

import { db } from "@/lib/db"

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
export async function createPreset (workspaceId: string, model?: string, name?: string, description?: string, temperature?: number, prompt?: string, include_workspace_instructions?: boolean) {
  const presetData = await db.preset.create({
    data: {
      workspaceId,
      model: model || "ollama",
      description: description || "",
      name: name || "Test",
      temperature: temperature || 0.8,
      prompt: prompt || "a",
      include_workspace_instructions: include_workspace_instructions || true
    }
  })
  return presetData
} 