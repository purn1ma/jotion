import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const document = await db.document.findMany({
      where: {
        userId: session.user.id,
        isArchived: true,
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return new Response(JSON.stringify(document))
  } catch (error) {
    return new Response("Error occured")
  }
}
