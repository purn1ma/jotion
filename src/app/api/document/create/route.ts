import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { DocumentValidator } from "@/lib/validators/document";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { title, parentDocumentId } = DocumentValidator.parse(body);

    // parentDocumentId field is optional if parentDocumentId is undefined and you don't pass this filed then by default prisma gives null value to them.
    // title === "" ? "untitled" : title
    // parentDocumentId !== undefined ? parentDocumentId : null
    const doc = await db.document.create({
      data: {
        title: title === "" ? "untitled" : title,
        parentDocumentId: parentDocumentId !== undefined ? parentDocumentId : null,
        userId: session.user.id,
        isArchived: false,
        isPublished: false,
      }
    });
    return new Response(JSON.stringify(doc));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(
      "Could not create notes at this time. Please try later",
      { status: 500 }
    );
  }
}
