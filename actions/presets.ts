"use server"
import { db } from "@/lib/db"
import { Preset } from "@prisma/client"

export async function getPresetWorkspacesByWorkspaceId(workspaceId: string) {
  const presetsInWorkspace = await db.preset.findMany({
    where: {
      workspaces: {
        some: {
          workspaceId,
        },
      },
    },
  });

  return presetsInWorkspace;
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
export async function updatePreset({
  description,
  includeWorkspaceInstructions,
  name,
  model,
  prompt,
  temperature,
  id,
  // workspaceIds,
}: Pick<Preset,| "id" | "description" | "includeWorkspaceInstructions" | "model" | "name" | "prompt" | "temperature">
  // & { workspaceIds: string[] }
) {
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
        // workspaces: {
        //   create: workspaceIds.map((workspaceId) => ({
        //     workspace: { connect: { id: workspaceId } },
        //   })),
        // },
      }
    })
    return preset
  } catch(e) {
  console.log("🚀 ~ e:", e)
  } 
}
export async function deletePresetWorkspaces(workspacePresetUniqueList: { workspaceId: string, presetId: string }[]) {
  console.log("🚀 ~ deletePresetWorkspaces ~ workspacePresetUniqueList:", workspacePresetUniqueList);
  if (workspacePresetUniqueList.length) {
    const presetId = workspacePresetUniqueList[0].presetId
      await db.workspacePreset.deleteMany({
        where: {
          presetId,
          workspaceId: {
            in: workspacePresetUniqueList.map((workspacePresetUnique) => workspacePresetUnique.workspaceId)
          }
        },
          
        
      });
  } 
    return true;
  
}
export async function deletePreset(presetId: string) {
  await db.preset.delete({
    where: {id: presetId}
  })  
}
export async function createPresetWorkspaces(workspacePresetUniqueList: { workspaceId: string, presetId: string }[]) {
  if (workspacePresetUniqueList.length) {
    const updatedPreset = await db.preset.update({
      where: {
        id: workspacePresetUniqueList[0].presetId,
      },
      data: {
        workspaces: {
          create: workspacePresetUniqueList.map((workspacePresetUnique) => ({
            workspace: {
              connect: {
                id: workspacePresetUnique.workspaceId,
              },
            },
          })),
        },
      },
    });
  
    if (!updatedPreset) {
      throw new Error("Failed to update preset");
    }

  }

  return true;
}
export async function createPreset({
  description,
  includeWorkspaceInstructions,
  name,
  model,
  prompt,
  temperature,
  workspaceId,
}: Pick<Preset,| "description" | "includeWorkspaceInstructions" | "model" | "name" | "prompt" | "temperature">
& { workspaceId: string }
) {
  try {
    const preset = db.preset.create({
      data: {
        description,
        includeWorkspaceInstructions,
        name,
        model,
        prompt,
        temperature,
        workspaces: {
          create: [{workspaceId}]
        },
      }
    })
    return preset
  } catch(e) {
    console.log("🚀 ~ createPreset ~ e:", e)
  } 
}