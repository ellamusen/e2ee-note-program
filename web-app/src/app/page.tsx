'use client'
import getNotes from "@/api/notes";
import { CreateNote } from "@/components/notes/CreateNote";
import NoteItem from "@/components/notes/NoteItem";
import NoteViewer from "@/components/notes/NoteViewer";
import PublicKeyBox from "@/components/publicKeyBox";
import Sidebar from "@/components/sidebar";
import { exportKeyPair, generateKeyPair, importKeyPair } from "@/functions/crypto";
import { getKeyPair, saveKeyPair } from "@/functions/localstorage";
import { decryptNote, decryptNotes } from "@/functions/note";
import { EncryptedNote, Note } from "@/types/Note";
import { useEffect, useState } from "react";


export default function Home() {

  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note>()
  const [keyPairs, setKeyPairs] = useState<CryptoKeyPair>()
  const [publicKeyB64, setPublicKeyB64] = useState<string>()

  // This function will be runned ONCE, at page load
  useEffect(() => {
    console.log("Checking local storage for existing keys")

    getKeyPair()
      .then(keys => {
        console.log("Found key pairs!")
      })
      .catch(async error => {
        console.error(error)
        console.warn("Generating new keys...")
        await generateKeyPair()
          .then(exportKeyPair)
          .then(saveKeyPair)
      })
      .finally(async () => {
        getKeyPair()
          .then(async keys => {
            setKeyPairs(keys)
            exportKeyPair(keys)
              .then(async exportedKeys => {
                setPublicKeyB64(exportedKeys.publicKey)
                getNotes(exportedKeys.publicKey)
                  .then(enecryptedNotes => {
                    decryptNotes(keys.privateKey, enecryptedNotes)
                      .then(setNotes)
                  })
              })
          })


      })
  }, [])


  return (
    <div className="flex min-h-screen bg-neutral-950 text-slate-100">
      <Sidebar>
        <div className="flex justify-center my-4">
          <CreateNote publicKey={keyPairs?.publicKey as CryptoKey} privateKey={keyPairs?.privateKey as CryptoKey} />
        </div>
        <div>
          {notes.map((note, i) => <NoteItem key={i} {...note} onClick={() => { setSelectedNote(note) }} />)}
        </div>
      </Sidebar>
      <main className="w-full">
        <div className="flex justify-end mt-12 mx-24">
          {publicKeyB64 && <PublicKeyBox publicKey={publicKeyB64} />}
        </div>
        <div className="mt-16 mx-24 max-w-3xl">
          {selectedNote && <NoteViewer {...selectedNote} />}
        </div>
      </main>
    </div>
  );
}
