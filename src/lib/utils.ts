import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge class names ---------------------------------------->

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sorting orders by date ---------------------------------------->

/**
 * Sorts an array of orders by their date property in descending order (latest first).
 * Assumes date is in 'Mon DD' format (e.g., 'Jan 15').
 * @param orders Array of orders with a 'date' property (string)
 * @returns Sorted array of orders
 */
export function sortOrdersByDateDesc<T extends { date: string }>(
  orders: T[]
): T[] {
  // Helper to parse 'Jan 15' as a Date in the current year
  const parseDate = (str: string): Date => {
    return new Date(`${str} ${new Date().getFullYear()}`);
  };
  return [...orders].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );
}
