import { create } from "zustand";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

const THEME_KEY = "user-theme";

export const useThemeStore = create<ThemeState>((set) => ({
  // initialize theme from localStorage if available, otherwise default to light
  theme:
    typeof window !== "undefined"
      ? (localStorage.getItem(THEME_KEY) as Theme) || "light"
      : "light",

  setTheme: (theme) => {
    console.log(`Theme changed to: ${theme}`);
    set({ theme });
    if (typeof window !== "undefined") localStorage.setItem(THEME_KEY, theme);
  },

  toggle: () =>
    set((s) => {
      const newTheme = s.theme === "light" ? "dark" : "light";
      console.log(`Theme toggled to: ${newTheme}`);
      if (typeof window !== "undefined") localStorage.setItem(THEME_KEY, newTheme);
      return { theme: newTheme };
    }),
}));

// Optional: debugging in browser console
if (typeof window !== "undefined") {
  (window as any).themeStore = useThemeStore;
}
