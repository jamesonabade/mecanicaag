
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark"); // Default to dark to match layout
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else {
      // If no stored theme, use system preference, but ensure it matches the initial HTML class if possible
      // The layout.tsx already sets 'dark' on HTML, so this primarily handles first-ever visit without localStorage
      const currentHtmlClass = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      setTheme(currentHtmlClass);
    }
  }, []);

  React.useEffect(() => {
    if (mounted) { // Only run this effect if mounted and theme has been determined
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
      {mounted && (theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />)}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
