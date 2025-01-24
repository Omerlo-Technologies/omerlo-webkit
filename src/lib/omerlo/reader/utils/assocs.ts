import type { ApiAssocs } from './api';

const assocsParsers: Record<string, (apiData: unknown, assocs: ApiAssocs) => unknown> = {};

export function registerAssocParser(assocName: string, parser: (arg: unknown) => unknown) {
  assocsParsers[assocName] = parser;
}

/**
 * Return the assoc corresponding the given `id`
 */
export function getAssoc<T>(assocs: ApiAssocs, name: string, id: string): T {
  const assoc = assocs[name]?.[id];

  if (assoc == undefined) {
    console.error(`Assoc ${name} not found`);
  }

  return assoc as T;
}

/**
 * Return assocs corresponding given `ids`
 */
export function getAssocs<T>(assocs: ApiAssocs, name: string, ids: string[]): T[] {
  return ids.map((id) => getAssoc(assocs, name, id));
}

/**
 * Parse all assocs using an ordering system to prevent any clone.
 */
export function parseAssocs(apiAssocs: ApiAssocs) {
  for (const assocName in apiAssocs) {
    const assocs = apiAssocs[assocName];

    for (const assocId in assocs) {
      const assoc = assocs[assocId];
      assocs[assocId] = assocsParsers[assocName](assoc, apiAssocs);
    }
  }
}

export type Assoc = unknown;
