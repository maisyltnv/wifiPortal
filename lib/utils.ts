import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function firstSearchParam(
  value: string | string[] | undefined,
): string {
  if (value == null) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
}
