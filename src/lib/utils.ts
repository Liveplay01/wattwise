import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Check if a lat/lng is within Germany's bounding box */
export function isInGermany(lat: number, lng: number): boolean {
  return lat >= 47.27 && lat <= 55.06 && lng >= 5.87 && lng <= 15.03;
}
