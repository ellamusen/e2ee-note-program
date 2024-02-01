'use client'
import { Note } from "@/types/Note";


type NoteViewerProps = Note
export default function NoteViewer(props: NoteViewerProps) {
    // const formatter = new Intl.DateTimeFormat("da-DK", {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", hour12: false, minute: "2-digit"})
    return (
        <div className="">
            <div className="text-xs text-neutral-500">
                {/* {formatter.format(props.createdAt)} */}
            </div>
            <h2 className="text-3xl font-medium mt-2">{props.title}</h2>
            {props.from != props.to && (
                <div className="flex gap-4 text-neutral-500 mt-4">
                    <div className="bg-black/50 px-3 py-1 text-xs rounded">{props.from}</div>
                    <div>-&gt;</div>
                    <div className="bg-black/50 px-3 py-1 text-xs rounded">{props.to}</div>
                </div>
            )}
            {props.from == props.to && (
                <div className="flex mt-4">
                    <div className="bg-black/50 px-3 py-1 text-xs rounded">Only me</div>
                </div>
            )}
            <div className="mt-16">
                {props.content}
            </div>
        </div>
    )
}