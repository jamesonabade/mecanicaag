"use client";

import * as React from "react";

export function ThemeToggle() {
  // Component now renders nothing, effectively removing the theme toggle.
  // The app will use the dark theme defined in :root in globals.css by default.
  
  React.useEffect(() => {
    // Ensure the 'dark' class is removed if it was previously set by this component,
    // as the theme is now controlled by :root styles.
    // Or, ensure 'dark' class is on html if tailwind config still relies on it for dark: variants
    // For simplicity with current setup, let's assume direct :root styling is enough.
    // If Tailwind dark: variants are needed, html should have 'dark' class.
    // The current globals.css is structured to make :root dark, so this might not be strictly needed.
    // However, to be safe and ensure Tailwind's dark: prefix works if used elsewhere based on the class:
    document.documentElement.classList.add("dark");
  }, []);

  return null;
}
