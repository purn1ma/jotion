import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DocumentValidator } from "@/lib/validators/document";
import { NextResponse } from "next/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";

const generateSlug = customAlphabet("abcdefghjkmnpqrstuvwxyz23456789", 10);

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, parentDocumentId } = DocumentValidator.parse(body);

    const doc = await db.document.create({
      data: {
        slug: generateSlug(),
        title: title === "" ? "Untitled" : title,
        parentDocumentId: parentDocumentId !== undefined ? parentDocumentId : null,
        userId: session.user.id,
        isArchived: false,
        isPublished: false,
      }
    });

    return NextResponse.json(doc);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[CREATE_DOCUMENT]", error);
    return NextResponse.json(
      { error: "Could not create note at this time. Please try later" },
      { status: 500 }
    );
  }
}
