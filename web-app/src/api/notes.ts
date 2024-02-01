import CONFIG from "@/config/env";
import { EncryptedNote } from "@/types/Note";


export default async function getNotes(publickey: string): Promise<EncryptedNote[]> {
    const res = await fetch(`${CONFIG.API}/mynotes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            publickey: publickey
        })
    })
    return await res.json() as EncryptedNote[]
}
