export type Assoc = unknown;
export type ApiAssocs = Record<string, Record<string, Assoc>>;;

let assocsParsers: Record<string, Function> = {};

export function registerAssocParser(assocName: string, parser: Function) {
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
  for (let assocName in apiAssocs) {
    const assocs = apiAssocs[assocName];

    for (let assocId in assocs) {
      const assoc = assocs[assocId];
      assocs[assocId] = assocsParsers[assocName](assoc, apiAssocs);
    }
  }
}
