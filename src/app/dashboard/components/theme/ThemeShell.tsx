"use client";

import { useThemeStore } from "store/theme/themeStore";

export default function ThemeShell({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  return (
    <div
      className={
        theme === "dark"
          ? "min-h-screen bg-gray-900 text-white"
          : "min-h-screen bg-gray-50 text-black"
      }
    >
      {children}
    </div>
  );
}
