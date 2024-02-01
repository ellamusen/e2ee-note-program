
export const ALGORITHM: RsaHashedKeyGenParams | EcKeyGenParams = {
    name: "ECDH",
    namedCurve: "P-256",
}
export const EXTRACTABLE: boolean = true
export const KEY_USAGES: KeyUsage[] = ["deriveKey", "deriveBits"]


/*
  Convert  an ArrayBuffer into a string
  from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  */
export function ab2str(buf: ArrayBuffer) {
    // @ts-ignore
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/**
 * This function will generate a ed25519 keypair using
 * the Web Crypto API.
 * This function will only work on client side.
 */
export function generateKeyPair(): Promise<CryptoKeyPair> {
    return new Promise((resolve, reject) => {
        if (typeof window == 'undefined') return reject("Window not defined")
        return resolve(window.crypto.subtle.generateKey(ALGORITHM, EXTRACTABLE, KEY_USAGES));
    })
}

export type ExportedKeyPairReturn = {
    publicKey: string,
    privateKey: string,
}
export async function exportKeyPair(keys: CryptoKeyPair): Promise<ExportedKeyPairReturn> {
    return new Promise(async (resolve, reject) => {
        if (typeof window == 'undefined') return reject("Window not defined")

        return resolve({
            publicKey: await exportPublicKeySPKI(keys.publicKey),
            privateKey: await exportPrivateKeyPKCS8(keys.privateKey),
        })
    })
}

export async function importKeyPair(keys: ExportedKeyPairReturn): Promise<CryptoKeyPair> {
    return new Promise(async (resolve, reject) => {
        if (typeof window == 'undefined') return reject("Window not defined")

        return resolve({
            publicKey: await importPublicKeyBySPKI(keys.publicKey),
            privateKey: await importPrivateKeyByPKCS8(keys.privateKey),
        } as CryptoKeyPair)
    })
}

export async function exportPublicKeySPKI(publicKey: CryptoKey): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const exported = await window.crypto.subtle.exportKey("spki", publicKey);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        return resolve(exportedAsBase64);
    })
}

export async function importPublicKeyBySPKI(publicKeyB64: string): Promise<CryptoKey> {
    const keyBuffer = new Uint8Array(atob(publicKeyB64).split('').map(char => char.charCodeAt(0)));
    const publicKey = await crypto.subtle.importKey('spki', keyBuffer.buffer, ALGORITHM, EXTRACTABLE, []);
    return publicKey;
}

async function exportPrivateKeyPKCS8(privateKey: CryptoKey): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const exported = await window.crypto.subtle.exportKey("pkcs8", privateKey);
        const exportedAsString = ab2str(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        return resolve(exportedAsBase64);
    })
}

async function importPrivateKeyByPKCS8(privateKeyB64: string): Promise<CryptoKey> {
    const keyBuffer = new Uint8Array(atob(privateKeyB64).split('').map(char => char.charCodeAt(0)));
    const publicKey = await crypto.subtle.importKey('pkcs8', keyBuffer.buffer, ALGORITHM, EXTRACTABLE, ["deriveKey"]);
    return publicKey;
}


export async function deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey) {
    const sharedSecretKey = await window.crypto.subtle.deriveKey(
        {
            name: 'ECDH',
            public: publicKey,
        },
        privateKey,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['encrypt', 'decrypt']
    );

    return sharedSecretKey;
}

// Function to encrypt a message using the Web Crypto API
export async function encryptMessage(message: string, sharedSecretKey: CryptoKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        sharedSecretKey,
        data
    );

    return { iv, encryptedData };
}

// Function to decrypt a message using the Web Crypto API
export async function decryptMessage(encryptedData: ArrayBuffer, sharedSecretKey: CryptoKey, iv: Uint8Array) {
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        sharedSecretKey,
        encryptedData
    );

    const decoder = new TextDecoder();
    const decryptedMessage = decoder.decode(decryptedData);

    return decryptedMessage;
}

