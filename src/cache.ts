import { Contributor } from "./index";

export interface CachedData {
  data: Contributor[];
  timestamp: number;
}

export function getCachedData(cacheKey: string): CachedData | null {
  const cachedData = localStorage.getItem(cacheKey);
  return cachedData ? JSON.parse(cachedData) : null;
}

export function setCachedData(cacheKey: string, data: Contributor[]): void {
  const cacheData: CachedData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheData));
}
