"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant/30 flex items-center justify-center opacity-0" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-10 h-10 rounded-full bg-surface-container-low border border-outline-variant hover:bg-surface-container-high text-on-surface hover:text-primary transition-all duration-300 flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
      aria-label="Toggle theme"
    >
      <span
        className={`material-symbols-outlined text-[20px] transition-all duration-500 absolute ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        light_mode
      </span>
      <span
        className={`material-symbols-outlined text-[20px] transition-all duration-500 absolute ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        dark_mode
      </span>
    </button>
  );
}
