import {  ExportedKeyPairReturn, importKeyPair } from "./crypto";

export const LOCALSTORAGE_KEYS = {
  privateKey: "privateKey",
  publicKey: "publicKey",
}

export function saveKeyPair(keys: ExportedKeyPairReturn): ExportedKeyPairReturn | null {
  if (typeof window == 'undefined') return null
  if (keys == null) return null

  localStorage.setItem(LOCALSTORAGE_KEYS.publicKey, keys.publicKey)
  localStorage.setItem(LOCALSTORAGE_KEYS.privateKey, keys.privateKey)

  return {
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
  }
}

export async function getKeyPair(): Promise<CryptoKeyPair> {
  return new Promise(async (resolve, reject) => {
    if (typeof window == 'undefined') return reject("Window not defined")

    const publicKey = localStorage.getItem(LOCALSTORAGE_KEYS.publicKey)
    const privateKey = localStorage.getItem(LOCALSTORAGE_KEYS.privateKey)

    if (publicKey == null || privateKey == null) {
      return reject("One or both key pairs does not exist.")
    }

    const keyPair = await importKeyPair({publicKey, privateKey})
    return resolve(keyPair)
  })

}