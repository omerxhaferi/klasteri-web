"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const BOX = "flex items-center justify-center w-8 h-8 rounded-sm border"
/** On the page, and on the slate bar (the cluster page's header). */
const TONE = {
    page: "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
    bar: "border-white/30 text-white/80 hover:bg-white/10 hover:text-white",
}

export function ThemeToggle({ on = "page" }: { on?: "page" | "bar" }) {
    const { resolvedTheme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    // Same box, empty, so the header does not shift when the icon arrives.
    if (!mounted) {
        return <div className={`${BOX} ${on === "bar" ? "border-white/30" : "border-border"}`} />
    }

    // `resolvedTheme`, not `theme`: on the default "system" setting `theme` is
    // the string "system", so comparing it to "dark" always chose dark first
    // and a reader on a dark OS had to press the button twice.
    const isDark = resolvedTheme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`${BOX} ${TONE[on]}`}
            aria-label={isDark ? "Kalo në pamjen e çelët" : "Kalo në pamjen e errët"}
        >
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
    )
}
