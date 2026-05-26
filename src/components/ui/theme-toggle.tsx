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
      {/* Sun Icon (shown in Dark mode to switch to Light) */}
      <span
        className={`transition-all duration-500 absolute ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-500">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM6.16 5.1a.75.75 0 0 1 1.06 0l1.59 1.59a.75.75 0 1 1-1.06 1.06L6.16 6.16a.75.75 0 0 1 0-1.06Zm12.72 0a.75.75 0 0 1 0 1.06l-1.59 1.59a.75.75 0 1 1-1.06-1.06l1.59-1.59a.75.75 0 0 1 1.06 0ZM12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-9.75 6a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75Zm13.5 0a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1-.75-.75ZM6.16 18.9a.75.75 0 0 1 0-1.06l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.59a.75.75 0 0 1-1.06 0Zm12.72 0a.75.75 0 0 1-1.06 0l-1.59-1.59a.75.75 0 1 1 1.06-1.06l1.59 1.59a.75.75 0 0 1 0 1.06ZM12 18.75a.75.75 0 0 1 .75.75V21.75a.75.75 0 0 1-1.5 0V19.5a.75.75 0 0 1 .75-.75Z" />
        </svg>
      </span>
      {/* Moon Icon (shown in Light mode to switch to Dark) */}
      <span
        className={`transition-all duration-500 absolute ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-700 hover:text-slate-900">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
        </svg>
      </span>
    </button>
  );
}
