import type { ApiData } from "./api";

export interface LocalesMetadata {
  current: string,
  available: string[]
}

export function parseLocalesMetadata(meta: ApiData): LocalesMetadata {
  return {
    current: meta.current,
    available: meta.available,
  }
}
