import { clsx, type ClassValue } from "clsx"
import { log } from "console";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}