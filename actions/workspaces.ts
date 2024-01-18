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
  defaultMaxTokens,
  defaultModel,
  defaultPrompt,
  defaultRepetitionPenalty,
  defaultTemperature,
  defaultTopK,
  defaultTopP,
  isHome,
  instructions,
  includeWorkspaceInstructions
}: Pick<Workspace,
  |"id"
  |'name' 
  |'description' 
  |"defaultMaxTokens" 
  |"defaultModel"
  |"includeWorkspaceInstructions"
  |"defaultPrompt"
  |"defaultTopK"
  |"defaultTopP"
  |"defaultTemperature"
  |"defaultRepetitionPenalty"
  |"instructions"
  |"isHome"

>) {
  const workspace = await db.workspace.update({
    where: {
      id
    },
    data: {
      name,
      description,
      instructions,
      defaultMaxTokens,
      defaultModel,
      defaultPrompt,
      defaultRepetitionPenalty,
      defaultTemperature,
      defaultTopK,
      defaultTopP,
      includeWorkspaceInstructions,
      isHome,
    }
  });
  return workspace
}


export async function createWorkspace({
  name,
  description,
  defaultMaxTokens,
  defaultModel,
  defaultPrompt,
  defaultRepetitionPenalty,
  defaultTemperature,
  defaultTopK,
  defaultTopP,
  instructions,
  isHome
}: Pick<Workspace, 
  |'name' 
  |'description' 
  |"defaultMaxTokens" 
  |"defaultModel"
  |"instructions"
  |"defaultPrompt"
  |"defaultTopK"
  |"defaultTopP"
  |"defaultTemperature"
  |"defaultRepetitionPenalty"
  |"isHome"

>) {
  const workspace = await db.workspace.create({
    data: {
      name,
      description,
      instructions,
      defaultMaxTokens,
      defaultModel,
      defaultPrompt,
      defaultRepetitionPenalty,
      defaultTemperature,
      defaultTopK,
      defaultTopP,
      isHome
    }
  });
  return workspace
}
