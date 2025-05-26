import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from "$reader/utils/api";
import { getAssoc, getAssocs } from "../utils/assocs"
import { requestPublisher } from "../utils/request";
// import type { Profiles } from "/profiles";

export const mediaBlockFetchers = (f: typeof fetch) => {
  const getBlock = getMediaBlock(f);
  return {
    getMediaBlock: getBlock,
    listMediaBlocks: listMediaBlocks(f),
    getPersonBlock: (id: string) => getBlock('people', id),
    getEventBlock: (id: string) => getBlock('events', id),
    getProjectBlock: (id: string) => getBlock('projects', id),
    getOrganizationBlock: (id: string) => getBlock('organizations', id),
  }
}
export type MediaType = 'people' | 'events' | 'projects' | 'organizations';

export type RelationKind = 'event' | 'person' | 'project' | 'organization';
export type BlockKind = 'selected_content' | RelationKind;

export type MediaBlockBase = {
  id: string;
  kind: BlockKind;
  profileTypeId: string;
  blockTypeID: string;
  localized: {
    locale: string;
    name: string;
  }
  updatedAt: Date;
  layout: string | null;
};

export interface MediaBlockContent extends MediaBlockBase {
  kind: 'selected_content';
  contentId: string[];
}

export interface MediaBlockRelations extends MediaBlockBase {
  kind: RelationKind;
  // layout?: Profiles[];
  profileIDs: string[] | null;
  // profileIDs: Profiles[] | null;
}

export type MediaBlock = MediaBlockContent | MediaBlockRelations;

// Helper function to determine if a kind is a relation type
const isRelationKind = (kind: string): kind is RelationKind => 
  ['event', 'person', 'project', 'organization'].includes(kind);

export function parseMediaBlock(data: ApiData, assocs: ApiAssocs): MediaBlock {
  
  if (data.kind === 'selected_content') {
    return {
      ...parseMediaBlockBase(data, assocs),
      kind: 'selected_content',
      contentId: data.content_id
    };
  }
  
  if (isRelationKind(data.kind)) {
    return {
      ...parseMediaBlockBase(data, assocs),
      kind: data.kind,
      profileIDs: null,
      // profileIDs: getAssocs(assocs, 'profiles', data.profile_ids),
    };
  }
  
  throw new Error(`Unknown media block kind: ${data.kind}`);
}

function parseMediaBlockBase(data: ApiData, assocs: ApiAssocs): Omit<MediaBlockBase, 'kind'> {
  return {
    id: data.id,
    profileTypeId: data.profile_type_id,
    layout: null,
    // layout: getAssoc(data, 'profiles', data.layout),
    blockTypeID: data.block_type_id,
    localized: {
      locale: data.localized.locale,
      name: data.localized.name,
    },
    updatedAt: new Date(data.updated_at),
  };
}

export function getMediaBlock(f: typeof fetch) {
  return async (mediaType: MediaType, id: string) => {
    const opts = { parser: parseMediaBlock };
    return requestPublisher(f, `/${mediaType}/${id}/blocks`, opts);
  }
}

export function listMediaBlocks(f: typeof fetch) {
  return async (mediaType: MediaType, params?: Partial<PagingParams>) => {
    const queryParams = params;
    const opts = { parser: parseMany(parseMediaBlock), queryParams };
    return requestPublisher(f, `/${mediaType}`, opts);
  };
}
