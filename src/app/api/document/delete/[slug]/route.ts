import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { document } from "@/types/document";

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getAuthSession();
    
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const documentId = params.slug;

    // Searching for archive document
    const existingDocument: document | null = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!existingDocument) {
      return new Response("Document not found");
    }

    if (existingDocument.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.document.delete({
      where: {
        id: documentId,
      },
    });
    return new Response("OK");
  } catch (error) {
    return new Response("Could not delete document")
  }
}
