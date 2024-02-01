import { EncryptedNote, Note } from "@/types/Note";
import { decryptMessage, deriveSharedSecret, importPublicKeyBySPKI } from "./crypto";

export async function decryptNotes(privateKey: CryptoKey, notes: EncryptedNote[]) {
    return await Promise.all(
        notes.map(async (note) => await decryptNote(privateKey, note.to, note))
    )

}

export async function decryptNote(privateKey: CryptoKey, publicKey: string, note: EncryptedNote): Promise<Note> {
    const pub2cryptokey = await importPublicKeyBySPKI(publicKey)
    const secretKey = await deriveSharedSecret(privateKey, pub2cryptokey)

    const [title, titleIV] = [atob(note.title), atob(note.titleIV)]
    const [content, contentIV] = [atob(note.content), atob(note.contentIV)]

    const titleArrayBuffer = new ArrayBuffer(title.length)
    const titleUint8Array = new Uint8Array(titleArrayBuffer)
    for (let i = 0; i < title.length; i++) {
        titleUint8Array[i] = title.charCodeAt(i)
    }
    const titleIVArrayBuffer = new ArrayBuffer(titleIV.length)
    const titleIVUint8Array = new Uint8Array(titleIVArrayBuffer)
    for (let i = 0; i < titleIV.length; i++) {
        titleIVUint8Array[i] = titleIV.charCodeAt(i)
    }


    const contentArrayBuffer = new ArrayBuffer(content.length)
    const contentUint8Array = new Uint8Array(contentArrayBuffer)
    for (let i = 0; i < content.length; i++) {
        contentUint8Array[i] = content.charCodeAt(i)
    }
    const contentIVArrayBuffer = new ArrayBuffer(contentIV.length)
    const contentIVUint8Array = new Uint8Array(contentIVArrayBuffer)
    for (let i = 0; i < contentIV.length; i++) {
        contentIVUint8Array[i] = contentIV.charCodeAt(i)
    }

    const decryptedTitle = await decryptMessage(titleUint8Array.buffer, secretKey, titleIVUint8Array)
    const decryptedContent = await decryptMessage(contentUint8Array.buffer, secretKey, contentIVUint8Array)

    return {
        title: decryptedTitle,
        content: decryptedContent,
        createdAt: note.createdAt,
        from: note.from,
        to: note.to
    }
}