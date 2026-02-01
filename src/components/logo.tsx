"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Logo({ width = 32, height = 32 }: { width?: number, height?: number }) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    const src = mounted && resolvedTheme === "dark" ? "/dark.jpg" : "/icon.png"

    return (
        <Image
            src={src}
            alt="Klasteri"
            width={width}
            height={height}
            className="rounded bg-white transition-opacity duration-300"
        />
    )
}
