import { z } from "zod";

export const DocumentValidator = z.object({
  title: z.string(),
  parentDocumentId: z.optional(z.string())
})

export const UpdateDocumentValidator = z.object({
  id: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  coverImage: z.string().optional(),
  icon: z.string().optional(),
  isPublished: z.boolean().optional()
})
 
export type CreateDocumentPayload = z.infer<typeof DocumentValidator>
export type UpdateDocumentPayload = z.infer<typeof UpdateDocumentValidator>