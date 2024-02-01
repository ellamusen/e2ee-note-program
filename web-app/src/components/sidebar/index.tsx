'use client'
import { ReactNode } from "react"

type Props = {
    children: ReactNode
}
export default function Sidebar({ children }: Props) {
    return (
        <aside className="min-w-72 pt-8 border-r border-neutral-800">
            <div className="flex flex-col gap-2 text-center text-xl font-bold mb-8">
                <div>🔒</div>
                <div>SECURE NOTES</div>
            </div>
            {children}
        </aside>
    )
}