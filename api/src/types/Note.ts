

type Note = {
    id: string
    from: string
    to: string
    title: string
    titleIV: string
    content: string
    contentIV: string
    createdAt: Date
}

export type NoteInput = Omit<Note, "id" | "createdAt">
export type NoteDbCreate = Omit<Note, "id">
export type NoteDBResponse = Note
