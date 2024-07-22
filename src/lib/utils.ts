import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function fomratRelativeDate(date: Date): string {
  const current = new Date();
  if (current.getDate() - date.getDate() <= 1) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } else {
    if (current.getFullYear() === date.getFullYear()) {
      return formatDate(date, "MMM d");
    }

    return formatDate(date, "MMM d, yyy");
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
