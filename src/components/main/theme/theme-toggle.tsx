"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle({ title }: { title?: boolean }) {
  const { theme, setTheme } = useTheme();
  const newTheme = theme === "dark" ? "light" : "dark";
  return (
    <Button
      title={`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode`}
      variant="ghost"
      className=" w-fit"
      onClick={() => setTheme(newTheme)}
    >
      {newTheme === "light" ? <Sun /> : <Moon />}
      {title && `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Theme`}
    </Button>
  );
}
