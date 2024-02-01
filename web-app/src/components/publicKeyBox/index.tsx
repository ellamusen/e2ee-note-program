

type PublicKeyBoxProps = {
    publicKey: string
}
export default function PublicKeyBox(props: PublicKeyBoxProps) {
    return (
        <div className="bg-neutral-800 p-4 rounded max-w-2xl break-words text-neutral-400">
            <div className="font-bold text-neutral-600">Your public key</div>
            {props.publicKey}
            {}
        </div>
    )
}