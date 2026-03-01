"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kthehu
        </button>
    );
}
