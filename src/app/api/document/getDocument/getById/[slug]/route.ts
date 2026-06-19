import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { slug: string }}) {
  try {
    const session = await getAuthSession()

    if(!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const param = params.slug

    // Try slug first, fall back to id (for notes created before slugs were added)
    const document = await db.document.findFirst({
      where: {
        userId: session.user.id,
        OR: [{ slug: param }, { id: param }],
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(document);

  } catch (error) {
    console.error("[GET_DOCUMENT_BY_ID]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
