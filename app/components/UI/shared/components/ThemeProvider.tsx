"use client";

import {
  createContext,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import { setClientCookie } from "@/utils/cookies/cookies.client";

export type Theme = "dark" | "light";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",
  storageKey = "theme",
  ...props
}) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setClientCookie(storageKey, newTheme, {
        maxAge: 60 * 60 * 24 * 365,
      });
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
