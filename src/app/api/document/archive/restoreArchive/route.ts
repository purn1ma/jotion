import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { document } from "@/types/document";

export async function PATCH(req: Request, { params }: { params: { slug: string }}) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json()
    const { documentId } = body

    const existingDocument: document | null = await db.document.findUnique({
      where: {
        id: documentId,
        isArchived: true,
      }
    })

    if(!existingDocument) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if(existingDocument.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recursiveRestore = async (documentId: string) => {
      const children = await db.document.findMany({
        where: { userId: session.user.id, parentDocumentId: documentId },
      });

      for (const child of children) {
        await db.document.update({
          where: { id: child.id },
          data: { isArchived: false },
        });

        await recursiveRestore(child.id);
      }
    };

    let options: { isArchived: boolean, parentDocumentId?: null} = {
      isArchived: false,
    };

    if(existingDocument.parentDocumentId) {
      const parent = await db.document.findUnique({
        where: {
          id: existingDocument.parentDocumentId
        }
      })

      if (parent?.isArchived) {
        options.parentDocumentId = null;
      }
    }

    const document = await db.document.update({
      where: { id: documentId },
      data: options,
    });

    await recursiveRestore(documentId);

    return NextResponse.json(document);
  } catch (error) {
    console.error("[RESTORE_ARCHIVE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
