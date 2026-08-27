import React, {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';

import {
    COLORS,
    DARK_COLORS,
} from '../constants/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
    mode: ThemeMode;
    isDark: boolean;
    colors: typeof COLORS;
    toggleTheme: () => void;
}

const ThemeContext =
    createContext<ThemeContextValue | undefined>(
        undefined,
    );

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] =
        useState<ThemeMode>('light');

    const isDark = mode === 'dark';

    const colors = useMemo(
        () => ({
            ...COLORS,
            ...(isDark ? DARK_COLORS : {}),
        }),
        [isDark],
    );

    const toggleTheme = () => {
        setMode(current =>
            current === 'light' ? 'dark' : 'light',
        );
    };

    const value = useMemo(
        () => ({
            mode,
            isDark,
            colors,
            toggleTheme,
        }),
        [mode, isDark, colors],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used inside ThemeProvider',
        );
    }

    return context;
}