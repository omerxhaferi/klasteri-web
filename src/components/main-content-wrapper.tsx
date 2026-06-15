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
        <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            {children}
        </main>
    );
}
