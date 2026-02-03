"use client";

import { ReactNode } from "react";
import { useNightMode } from "@/hooks/use-night-mode";

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
    const clientIsNight = useNightMode();

    // Determine if the left "In Focus" sidebar will be visible
    // Left sidebar shows when: (isNight OR forceShow) AND hasClusters
    const leftSidebarVisible = (clientIsNight || serverIsNight || forceShow) && hasTonightClusters;

    // When left sidebar is visible, use max-w-7xl to fit both sidebars
    // Otherwise use max-w-6xl to fit just content + right ads sidebar
    return (
        <main className={`mx-auto px-4 py-6 transition-all duration-300 ${leftSidebarVisible ? 'max-w-7xl' : 'max-w-6xl'}`}>
            {children}
        </main>
    );
}

