

export type Note = {
    from: string,
    to: string,
    title: string,
    content: string,
    createdAt: Date
}

export type EncryptedNote = Note & {
    id: string,
    createdAt: Date,
    titleIV: string,
    contentIV: string
} 
export type EncryptedNotePackage = Omit<EncryptedNote, "id" | "createdAt">