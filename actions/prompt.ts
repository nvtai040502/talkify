"use server"
import { db } from "@/lib/db"
import { Preset, Prompt } from "@prisma/client"

export async function getPromptWorkspacesByWorkspaceId(workspaceId: string) {
  const promptsInWorkspace = await db.prompt.findMany({
    where: {
      workspaces: {
        some: {
          workspaceId,
        },
      },
    },
  });

  return promptsInWorkspace;
}
export async function getPresetWorkspacesByPresetId (presetId: string) {
    const preset = await db.preset.findUnique({
      where: {
        id: presetId
      }
    })
    if (!preset) {
      console.log("🚀 ~ getPresetWorkspacesByPresetId ~ e:",)
      throw new Error("some thing went worng")
    }
    return preset

}
export async function updatePrompt({
  name,
  content,
  id,
  // workspaceIds,
}: Pick<Prompt,| "id" | "content" | "name">
  // & { workspaceIds: string[] }
) {
  try {
    const prompt = db.prompt.update({
      where: {
        id
      },
      data: {
        name,
        content
        // workspaces: {
        //   create: workspaceIds.map((workspaceId) => ({
        //     workspace: { connect: { id: workspaceId } },
        //   })),
        // },
      }
    })
    return prompt
  } catch(e) {
  console.log("🚀 ~ e:", e)
  } 
}
export async function deletePromptWorkspaces(workspacePromptUniqueList: { workspaceId: string, promptId: string }[]) {
  if (workspacePromptUniqueList.length) {
    const promptId = workspacePromptUniqueList[0].promptId
      await db.workspacePrompt.deleteMany({
        where: {
          promptId,
          workspaceId: {
            in: workspacePromptUniqueList.map((workspacePromptUnique) => workspacePromptUnique.workspaceId)
          }
        },
          
        
      });
  } 
    return true;
  
}
export async function deletePrompt(promptId: string) {
  console.log(promptId)
  await db.prompt.delete({
    where: {id: promptId}
  })  
}
export async function createPromptWorkspaces(workspacePromptUniqueList: { workspaceId: string, promptId: string }[]) {
  if (workspacePromptUniqueList.length) {
    const updatedPrompt = await db.prompt.update({
      where: {
        id: workspacePromptUniqueList[0].promptId,
      },
      data: {
        workspaces: {
          create: workspacePromptUniqueList.map((workspacePromptUnique) => ({
            workspace: {
              connect: {
                id: workspacePromptUnique.workspaceId,
              },
            },
          })),
        },
      },
    });
  
    if (!updatedPrompt) {
      throw new Error("Failed to update prompt");
    }

  }

  return true;
}
export async function createPrompt({
  name,
  content,
  workspaceId
}: Pick<Prompt,| "name" | "content">
& { workspaceId: string }
) {
  try {
    const prompt = db.prompt.create({
      data: {
        name,
        content,
        workspaces: {
          create: [{workspaceId}]
        },
      }
    })
    return prompt
  } catch(e) {
    console.log("🚀 ~ createprompt ~ e:", e)
  } 
}