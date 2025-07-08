"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle({
  title,
  themeMode,
  setthemeMode,
}: {
  title?: boolean;
  setthemeMode?: (theme: string) => void;
  themeMode?: string;
}) {
  const { theme, setTheme } = useTheme();
  const isDark = theme == "dark";
  const nextTheme = isDark ? "light" : "dark";
  const capitalized = `${nextTheme.charAt(0).toUpperCase()}${nextTheme.slice(
    1
  )}`;

  return (
    <Button
      title={`${capitalized} mode`}
      variant='link'
      className="w-fit text-muted-foreground"
      onClick={() => {
        setTheme(nextTheme);
        if (themeMode && setthemeMode) setthemeMode(nextTheme);
      }}
    >
      {isDark ? <Sun /> : <Moon />}
      {title && `${capitalized} Theme`}
    </Button>
  );
}
