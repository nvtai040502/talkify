"use server"
import { db } from "@/lib/db"
import { Workspace } from "@prisma/client"

export async function getWorkSpaces(userId?: string | null) {
  const workSpaces = await db.workspace.findMany({
    orderBy: {
      updatedAt: "desc"
    }
  })
  return workSpaces
}
export async function getWorkspacesByPresetId(presetId: string) {
  const workspacesInPreset = await db.workspace.findMany({
    where: {
      presets: {
        some: {
          presetId,
        },
      },
    },
  });

  return workspacesInPreset;
}
export async function deleteWorkspace(id: string) {
  await db.workspace.delete({
    where: {
      id
    }
  })
}

export async function updateWorkspace({
  id,
  name,
  description,
  defaultModel,
  defaultPrompt,
  defaultTemperature,
  isHome,
  instructions,
  includeWorkspaceInstructions
  // defaultTopP,
  // defaultTopK,
  // defaultRepetitionPenalty,
  // defaultMaxTokens,
}: Pick<Workspace,
  |"id"
  |'name' 
  |'description' 
  |"defaultModel"
  |"includeWorkspaceInstructions"
  |"defaultPrompt"
  |"defaultTemperature"
  |"instructions"
  |"isHome"
  // |"defaultRepetitionPenalty"
  // |"defaultMaxTokens" 
  // |"defaultTopK"
  // |"defaultTopP"

>) {
  const workspace = await db.workspace.update({
    where: {
      id
    },
    data: {
      name,
      description,
      instructions,
      defaultModel,
      defaultPrompt,
      defaultTemperature,
      includeWorkspaceInstructions,
      isHome,
      // defaultMaxTokens,
      // defaultRepetitionPenalty,
      // defaultTopK,
      // defaultTopP,
    }
  });
  return workspace
}


export async function createWorkspace({
  name,
  description,
  defaultModel,
  defaultPrompt,
  defaultTemperature,
  instructions,
  isHome
  // defaultMaxTokens,
  // defaultRepetitionPenalty,
  // defaultTopK,
  // defaultTopP,
}: Pick<Workspace, 
  |'name' 
  |'description' 
  |"defaultModel"
  |"instructions"
  |"defaultPrompt"
  |"defaultTemperature"
  |"isHome"
  // |"defaultMaxTokens" 
  // |"defaultTopK"
  // |"defaultTopP"
  // |"defaultRepetitionPenalty"

>) {
  const workspace = await db.workspace.create({
    data: {
      name,
      description,
      instructions,
      defaultModel,
      defaultPrompt,
      defaultTemperature,
      isHome
      // defaultRepetitionPenalty,
      // defaultMaxTokens,
      // defaultTopK,
      // defaultTopP,
    }
  });
  return workspace
}
