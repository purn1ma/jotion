import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { document } from "@/types/document";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documentId = params.slug;

    const existingDocument: document | null = await db.document.findUnique({
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

    await db.document.delete({
      where: {
        id: documentId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE_DOCUMENT]", error);
    return NextResponse.json({ error: "Could not delete document" }, { status: 500 });
  }
}
