import { Chat } from "@prisma/client";
import { type ClassValue, clsx } from "clsx"
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};
export function isMacOs() {
  if (typeof window === "undefined") return false

  return window.navigator.userAgent.includes("Mac")
}

export const parsedSearchParams  = (params: ReadonlyURLSearchParams) => {
  return Object.fromEntries(params.entries())
}

export const getChatsSortedByDate = (
  data: Chat[],
  dateCategory: "Today" | "Yesterday" | "Previous Week" | "Older"
) => {
  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);
  const oneWeekAgoStart = new Date(todayStart);
  oneWeekAgoStart.setDate(todayStart.getDate() - 7);

  return data
    .filter((item) => {
      const itemDate = new Date(item.updatedAt || item.createdAt);
      switch (dateCategory) {
        case "Today":
          return itemDate >= todayStart;
        case "Yesterday":
          return itemDate >= yesterdayStart && itemDate < todayStart;
        case "Previous Week":
          return itemDate >= oneWeekAgoStart && itemDate < yesterdayStart;
        case "Older":
          return itemDate < oneWeekAgoStart;
        default:
          return true;
      }
    })
    .sort(
      (a: { updatedAt: Date; createdAt: Date }, b: { updatedAt: Date; createdAt: Date }) =>
        b.updatedAt.getTime() - a.updatedAt.getTime()
    );
};