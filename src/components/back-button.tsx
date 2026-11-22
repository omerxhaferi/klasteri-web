"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="mb-3 text-[13px] font-bold text-primary hover:underline"
        >
            « Kthehu
        </button>
    );
}
