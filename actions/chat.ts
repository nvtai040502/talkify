"use server";

import { db } from "@/lib/db";

export async function createChat() {
  const chat = await db.chat.create({
    data: {
      name: "Home",
    },
  });

  return { chat, success: true };
}