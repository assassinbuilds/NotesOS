"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg
        bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700
        transition-all duration-200 group"
      aria-label="Toggle theme"
      id="theme-toggle"
    >
      {theme === "light" && <Sun className="w-[18px] h-[18px] text-accent-500 transition-transform group-hover:rotate-45" />}
      {theme === "dark" && <Moon className="w-[18px] h-[18px] text-primary-300 transition-transform group-hover:-rotate-12" />}
      {theme === "system" && <Monitor className="w-[18px] h-[18px] text-surface-500 transition-transform group-hover:scale-110" />}
    </button>
  );
}
