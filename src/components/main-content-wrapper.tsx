"use client";

import { ReactNode } from "react";

interface MainContentWrapperProps {
    children: ReactNode;
    hasTonightClusters: boolean;
    serverIsNight: boolean;
    forceShow?: boolean;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
    return (
        <main className="w-full flex-1 max-w-7xl mx-auto px-4 py-4 md:py-5">
            {children}
        </main>
    );
}
