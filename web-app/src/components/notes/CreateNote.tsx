import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import React, { FormEventHandler, useState } from "react"
import { ab2str, decryptMessage, deriveSharedSecret, encryptMessage, exportKeyPair, importPublicKeyBySPKI } from "@/functions/crypto"
import { EncryptedNote, EncryptedNotePackage } from "@/types/Note"
import CONFIG from "@/config/env"

type CreateNoteProps = {
    privateKey: CryptoKey,
    publicKey: CryptoKey,
    callback?: () => {}
}
export function CreateNote({ publicKey, privateKey, callback }: CreateNoteProps) {

    // const [showPublicKey, setShowPublicKey] = useState<boolean>(false)
    const [note, setNote] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    // Use the current user's public key, then it will only be avaialable for that user.
    const [receiverPublicKey, setReceiverPublicKey] = useState<string>()

    function updateTitle(event: React.FormEvent<HTMLInputElement>) {
        setTitle(event.currentTarget.value)
    }
    function updatePublicKey(event: React.FormEvent<HTMLInputElement>) {
        setReceiverPublicKey(event.currentTarget.value)
    }
    function updateNote(event: React.FormEvent<HTMLTextAreaElement>) {
        setNote(event.currentTarget.value)
    }

    async function encryptNote() {
        const keypair = exportKeyPair({ publicKey, privateKey })
        const receiverPublicKeyB64 = receiverPublicKey
        // If the user did add a public key, then use our own public key
        const receiverCryptoKey = await importPublicKeyBySPKI(receiverPublicKeyB64 || (await keypair).publicKey)
        const secretKey = await deriveSharedSecret(privateKey, receiverCryptoKey)

        const encryptedNote = await encryptMessage(note, secretKey)
        const encryptedTitle = await encryptMessage(title, secretKey)

        const encryptedPackage: EncryptedNotePackage = {
            to: receiverPublicKeyB64 || (await keypair).publicKey,
            from: (await keypair).publicKey,
            content: btoa(ab2str(encryptedNote.encryptedData)),
            contentIV: btoa(ab2str(encryptedNote.iv)),
            title: btoa(ab2str(encryptedTitle.encryptedData)),
            titleIV: btoa(ab2str(encryptedTitle.iv))
        }
        fetch(`${CONFIG.API}/notes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(encryptedPackage)
        })
        .then(res => {})


    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"secondary"}>Create new note</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create a new encrypted note</DialogTitle>
                    <DialogDescription className="pt-2">
                        Create a new secure note here. This note will be end-to-end encrypted
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="note-title">Title</Label>
                        <Input onChange={updateTitle} type="text" id="note-title" placeholder="Note title" />
                    </div>
                </div>

                {/* <div className="flex items-center space-x-2">
                    <Checkbox id="send-to-another" onClick={() => { setShowPublicKey(!showPublicKey) }} />
                    <label
                        htmlFor="send-to-another"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Share this message with another?
                    </label>
                </div>
                {showPublicKey && (
                    <div className="grid gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Input type="text" onChange={updatePublicKey} id="receiver-publickey" placeholder="Receivers public key" />
                        </div>
                    </div>
                )}
 */}

                <div className="grid w-full gap-1.5 mt-6">
                    <Label htmlFor="message-2">Your Message</Label>
                    <Textarea onChange={updateNote} placeholder="Type your message here." id="message-2" />
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={encryptNote}>Create note</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
