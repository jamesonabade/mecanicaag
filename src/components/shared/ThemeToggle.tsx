
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Initialize theme as undefined to avoid assuming a default before client-side check
  const [theme, setTheme] = React.useState<"light" | "dark" | undefined>(undefined);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    let determinedTheme: "light" | "dark";
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (storedTheme) {
      determinedTheme = storedTheme;
    } else {
      // Fallback to the class set on the HTML tag by RootLayout,
      // then to system preference if class is not set (RootLayout sets it to dark by default).
      if (document.documentElement.classList.contains('dark')) {
        determinedTheme = 'dark';
      } else if (document.documentElement.classList.contains('light')) { // Explicitly check for light too
        determinedTheme = 'light';
      } else {
        // This branch should ideally not be hit if layout.tsx always sets "dark"
        // and there's no localStorage override.
        determinedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
    }
    setTheme(determinedTheme);
  }, []); // Runs once on mount to determine initial theme

  React.useEffect(() => {
    if (mounted && theme) { // Only apply changes if mounted and theme is determined
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light"); // Ensure light is removed if present
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light"); // Ensure light is added if not present
        localStorage.setItem("theme", "light");
      }
    }
  }, [theme, mounted]); // Runs when theme or mounted status changes

  const toggleTheme = () => {
    // If theme is somehow undefined when toggling, default to toggling from current light to dark
    setTheme((prevTheme) => {
      if (prevTheme === "light") return "dark";
      if (prevTheme === "dark") return "light";
      // Fallback if theme is undefined: check current class or default to dark.
      return document.documentElement.classList.contains("light") ? "dark" : "light";
    });
  };

  // Do not render the icon until theme is determined and component is mounted
  const renderIcon = () => {
    if (!mounted || !theme) {
      return null; // Or a placeholder like <div className="h-[1.2rem] w-[1.2rem]" />
    }
    return theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem]" /> : <Sun className="h-[1.2rem] w-[1.2rem]" />;
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent">
      {renderIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
