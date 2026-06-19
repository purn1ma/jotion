import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await db.document.findMany({
      where: {
        userId: session.user.id,
        parentDocumentId: params.slug,
        isArchived: false,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        userId: true,
        parentDocumentId: true,
        isArchived: true,
        coverImage: true,
        icon: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("[GET_DOCUMENTS_BY_PARENT_ID]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}