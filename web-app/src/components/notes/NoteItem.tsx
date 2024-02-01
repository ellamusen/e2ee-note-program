import { Note } from "@/types/Note"


type NoteItemProps = Note & {
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

export default function NoteItem(props: NoteItemProps) {
    return (
        <div className="py-4 px-4 border-b first:border-t border-neutral-900 cursor-pointer tex" onClick={props.onClick}>
            <h2 className="font-bold text-sm">{props.title}</h2>
            <p className="text-xs pt-2 text-neutral-500">{props.content.slice(0, 32)}</p>
        </div>
    )
}