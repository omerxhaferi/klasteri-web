"use client";

import { ReactNode } from "react";

interface MainContentWrapperProps {
    children: ReactNode;
    hasTonightClusters: boolean;
    serverIsNight: boolean;
    forceShow?: boolean;
}

export function MainContentWrapper({
    children,
    hasTonightClusters,
    serverIsNight,
    forceShow = false
}: MainContentWrapperProps) {
    const leftSidebarVisible = hasTonightClusters;

    return (
        <main className={`mx-auto px-4 py-6 transition-all duration-300 ${leftSidebarVisible ? 'max-w-7xl' : 'max-w-6xl'}`}>
            {children}
        </main>
    );
}
