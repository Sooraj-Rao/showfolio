import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ResumeNameSplit = (name: string) => {
  const split = name.split(".");
  split.pop();
  return split.join(".");
};
