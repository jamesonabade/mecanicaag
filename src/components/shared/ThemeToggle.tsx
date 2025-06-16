
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
      }
      // If no stored theme, check system preference but default to dark if app default is dark
      // The class 'dark' on <html> in layout.tsx sets the initial visual theme.
      // This logic primarily ensures the toggle button and localStorage are in sync.
      if (document.documentElement.classList.contains('dark')) {
        return "dark";
      }
    }
    return "light"; // Fallback if client-side check fails or if light is explicit initial
  });

  React.useEffect(() => {
    // This effect ensures the documentElement class and localStorage are updated
    // whenever the theme state changes.
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // This effect runs once on mount to synchronize with the actual document class
  // if it was set by the server (e.g., via layout.tsx)
  React.useEffect(() => {
    const isInitiallyDark = document.documentElement.classList.contains("dark");
    setTheme(isInitiallyDark ? "dark" : "light");
  }, []);


  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
      {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
