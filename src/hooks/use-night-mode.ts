"use client";

import { useState, useEffect } from 'react';

export function useNightMode() {
    const [isNightTime, setIsNightTime] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours();
            setIsNightTime(hour >= 21 || hour < 5); // 9 PM to 5 AM
        };

        checkTime(); // Initial check

        // Check every minute
        const interval = setInterval(checkTime, 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return isNightTime;
}
