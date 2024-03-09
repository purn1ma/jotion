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
    const { id, title, content, coverImage, icon, isPublished } = UpdateDocumentValidator.parse(body)
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
    // if any data which is undefiend then this will not update the data to undefiend
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

    return new Response(JSON.stringify(updatedDocument))
  } catch (error: any) {
    return new Response(error)
  }
}
