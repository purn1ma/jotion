import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { documentId } = body;
    
    const existingDocument = await db.document.findUnique({
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

    const document = await db.document.update({
      where: {
        id: documentId,
      },
      data: {
        icon: null,
      },
    });

    return new Response(JSON.stringify(document));
  } catch (error) {
    return new Response("Not able to remove icon")
  }
}
