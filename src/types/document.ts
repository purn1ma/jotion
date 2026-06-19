export type document = {
  id: string
  slug: string | null
  title: string
  userId: string
  parentDocumentId: string | null
  isArchived: boolean
  content?: string | null
  coverImage: string | null
  icon: string | null
  isPublished: boolean
}
