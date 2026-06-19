import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[SEARCH_DOCUMENTS]", error);
    return NextResponse.json({ error: "Not able to fetch document" }, { status: 500 });
  }
}
