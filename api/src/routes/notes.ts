import { Context } from "elysia";
import { db } from "../db/surrealdb";
import { NoteDBResponse, NoteDbCreate, NoteInput } from "../types/Note";


type GetAllNotesBody = {
    publickey: string
}
export async function getAllNotes(ctx: Context) {
    const body: GetAllNotesBody = ctx.body as GetAllNotesBody
    if (body.publickey == null) return { error: "No publickey given. Check your url params to be ?publickey=AAAA" }

    const [relatedNotes] = await db.query<NoteDBResponse[]>("SELECT * FROM note WHERE from == $pubkey OR to == $pubkey;", {
        pubkey: body.publickey
    })
    return relatedNotes

}
export async function createNote(ctx: Context) {
    const body: NoteInput = ctx.body as NoteInput
    const [created] = await db.create<NoteDbCreate>("note", {
        title: body.title,
        titleIV: body.titleIV,
        content: body.content,
        from: body.from,
        to: body.to,
        contentIV: body.contentIV,
        createdAt: new Date()
    });
    const all = await db.select<NoteDBResponse>("note");
    return all
}
