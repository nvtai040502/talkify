import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
     const chat = await db.chat.create({
      data: {
        name: "Home"
      }
     })

    return NextResponse.json(chat)
  } catch(error) {
    console.log("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 })
  }
}