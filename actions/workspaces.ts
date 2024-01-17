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
  isHome
}: Pick<Workspace,
  |"id"
  |'name' 
  |'description' 
  |"defaultMaxTokens" 
  |"defaultModel"
  |"defaultPrompt"
  |"defaultTopK"
  |"defaultTopP"
  |"defaultTemperature"
  |"defaultRepetitionPenalty"
  |"isHome"

>) {
  const workspace = await db.workspace.update({
    where: {
      id
    },
    data: {
      name,
      description,
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
  isHome
}: Pick<Workspace, 
  |'name' 
  |'description' 
  |"defaultMaxTokens" 
  |"defaultModel"
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
