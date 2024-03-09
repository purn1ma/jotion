import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UpdateDocumentValidator } from "@/lib/validators/document";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession()

    if(!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id } = body

    const existingDocument = await db.document.findUnique({
      where: {
        id,
      }
    })

    if(!existingDocument) {
      return new Response("Not Found")
    }

    if (existingDocument.userId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    const updatedDocument = await db.document.update({
      where: {
        id,
      },
      data: {
        coverImage: null,
      }
    })

    return new Response(JSON.stringify(updatedDocument))
  } catch (error) {
    return new Response("Update failed")
  }
}
