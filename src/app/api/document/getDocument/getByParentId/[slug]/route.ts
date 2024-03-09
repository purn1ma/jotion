import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    const session = await getAuthSession()

    if(!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const parentId = params.slug

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
        parentDocumentId: parentId,
        isArchived: false
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    if(documents === null) {
      return new Response("No")
    }

    return new Response(JSON.stringify(documents))

  } catch (error) {
    return new Response("Internal Server Error")
  }
}