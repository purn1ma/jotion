import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const documentId = params.slug;

    const existingDocument = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!existingDocument) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (existingDocument.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recursiveArchive = async (documentId: string) => {
      const children = await db.document.findMany({
        where: { userId: session.user.id, parentDocumentId: documentId },
      });

      for (const child of children) {
        await db.document.update({
          where: { id: child.id },
          data: { isArchived: true },
        });

        await recursiveArchive(child.id);
      }
    };

    const document = await db.document.update({
      where: { id: documentId },
      data: { isArchived: true },
    });

    await recursiveArchive(documentId);

    return NextResponse.json(document);
  } catch (error) {
    console.error("[ARCHIVE_DOCUMENT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
