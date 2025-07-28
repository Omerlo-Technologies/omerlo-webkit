import type { ApiAssocs, ApiData } from './api';

const assocsParsers: Record<string, (apiData: unknown, assocs: ApiAssocs) => unknown> = {};

export function registerAssocParser(
  assocName: string,
  parser: (apiData: unknown, assocs: ApiAssocs) => unknown
) {
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

export function initAssocs(apiAssocs: ApiAssocs): Record<string, Record<string, Assoc>> {
  const result: Record<string, Record<string, Assoc>> = {};

  for (const assocName in apiAssocs) {
    const assocs = apiAssocs[assocName];
    result[assocName] = {};

    // NOTE this is a workarround because we use publisher's api
    // Once we remove publisher's api from reader, we should remove this condition.
    if (!Array.isArray(assocs)) {
      result[assocName] = assocs;
      continue;
    }

    for (const assoc of assocs) {
      // FIXME we should implement a assoc_id handler because event's return
      // the occurrence id but the assoc's id is the event_id.
      result[assocName][assoc.id] = assoc;
    }
  }

  return result;
}

/**
 * Parse all assocs using an ordering system to prevent any clone.
 */
export function parseAssocs(apiAssocs: Record<string, Record<string, Assoc>>) {
  for (const assocName in apiAssocs) {
    const assocs = apiAssocs[assocName];

    for (const assocId in assocs) {
      const assoc = assocs[assocId];

      if (!assocsParsers[assocName]) {
        console.error(`No assoc parser found for ${assocName}`);
        continue;
      }

      assocs[assocId] = assocsParsers[assocName](assoc, apiAssocs);
    }
  }
}

export type Assoc = ApiData;
