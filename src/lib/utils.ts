import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function determineShift(exitTime: Date): 'Morning' | 'Evening' {
  const hour = exitTime.getHours();
  // Morning shift: 8 AM (8) to 7:59:59 PM (19)
  if (hour >= 8 && hour < 20) {
    return 'Morning';
  }
  // Evening shift: 8 PM (20) to 7:59:59 AM (7)
  return 'Evening';
}
