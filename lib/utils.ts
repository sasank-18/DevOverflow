import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const elapsedMilliseconds = now.getTime() - createdAt.getTime();
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const elapsedDays = Math.floor(elapsedHours / 24);
  const elapsedMonths = Math.floor(elapsedDays / 30);
  const elapsedYears = Math.floor(elapsedDays / 365);

  if (elapsedYears > 0) {
      return `${elapsedYears} year${elapsedYears > 1 ? 's' : ''} ago`;
  } else if (elapsedMonths > 0) {
      return `${elapsedMonths} month${elapsedMonths > 1 ? 's' : ''} ago`;
  } else if (elapsedDays > 0) {
      return `${elapsedDays} day${elapsedDays > 1 ? 's' : ''} ago`;
  } else if (elapsedHours > 0) {
      return `${elapsedHours} hour${elapsedHours > 1 ? 's' : ''} ago`;
  } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} minute${elapsedMinutes > 1 ? 's' : ''} ago`;
  } else {
      return `${elapsedSeconds} second${elapsedSeconds > 1 ? 's' : ''} ago`;
  }
};


export const formatAndDivideNumber = (number: number): string => {
  if (number >= 1000000) {
      const millions = number / 1000000;
      return `${millions.toFixed(1)}M`;
  } else if (number >= 1000) {
      const thousands = number / 1000;
      return `${thousands.toFixed(1)}K`;
  } else {
      return number.toString();
  }
};