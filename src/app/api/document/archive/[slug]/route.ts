import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthenticated", { status: 401 });
    }

    const documentId = params.slug;

    const existingDocument = await db.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (!existingDocument) {
      return new Response("Not Found");
    }

    if (existingDocument.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
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

    return new Response(JSON.stringify(document));
  } catch (error) {
    return new Response("Error occured")
  }
}
