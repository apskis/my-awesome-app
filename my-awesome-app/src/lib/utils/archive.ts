import { prisma } from '@/generated/prisma'

export async function archiveNote(noteId: string) {
  const note = await prisma.note.update({
    where: { id: noteId },
    data: {
      status: 'ARCHIVED',
      updatedAt: new Date(),
    },
  })
  return note
}

export async function unarchiveNote(noteId: string, status: 'PUBLISHED' | 'DRAFT' = 'PUBLISHED') {
  const note = await prisma.note.update({
    where: { id: noteId },
    data: {
      status,
      updatedAt: new Date(),
    },
  })
  return note
}
