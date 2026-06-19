import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
