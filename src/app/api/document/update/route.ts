import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UpdateDocumentValidator } from "@/lib/validators/document";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if(!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json()
    const { id, title, content, coverImage, icon, isPublished } = UpdateDocumentValidator.parse(body)
    const existingDocument = await db.document.findUnique({
      where: {
        id,
      }
    })

    if(!existingDocument) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (existingDocument.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedDocument = await db.document.update({
      where: {
        id,
      },
      data: {
        title,
        content,
        coverImage,
        icon,
        isPublished
      }
    })

    return NextResponse.json(updatedDocument);
  } catch (error: any) {
    console.error("[UPDATE_DOCUMENT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
