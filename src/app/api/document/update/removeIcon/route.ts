import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { documentId } = body;

    const existingDocument = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!existingDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (existingDocument.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const document = await db.document.update({
      where: {
        id: documentId,
      },
      data: {
        icon: null,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("[REMOVE_ICON]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
