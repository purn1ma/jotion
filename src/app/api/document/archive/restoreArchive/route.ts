import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { document } from "@/types/document";

export async function PATCH(req: Request, { params }: { params: { slug: string }}) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json()
    const { documentId } = body

    // Searching for archive document
    const existingDocument: document | null = await db.document.findUnique({
      where: {
        id: documentId,
        isArchived: true,
      }
    })

    if(!existingDocument) {
      return new Response("Document not found")
    }

    // Checking If document id and current session user id are same or not
    if(existingDocument.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 })
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

    recursiveRestore(documentId)

    return new Response(JSON.stringify(document));
  } catch (error) {
    return new Response("Error occured")
  }
}
