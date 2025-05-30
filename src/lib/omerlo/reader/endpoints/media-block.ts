import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from "$reader/utils/api";
import { requestPublisher } from "../utils/request";

export const mediaBlockFetchers = (f: typeof fetch) => {
  const getBlock = getMediaBlock(f);
  return {
    getMediaBlock: getBlock,
    listMediaBlocks: listMediaBlocks(f),
  }
}
export type MediaType = 'people' | 'events' | 'projects' | 'organizations';

export type MediaBlockBase = {
  id: string;
  kind: string;
  profileTypeId: string;
  blockTypeID: string;
  localized: {
    locale: string;
    name: string;
  }
  updatedAt: string;
  layout: string;
};

export interface MediaBlockContents extends MediaBlockBase {
  contentIds: [];
  // contentIds: Content[];
}

export interface MediaBlockRelations extends MediaBlockBase {
  profileIDs: [];
  // profileIDs: Profile[];
}

export type MediaBlock = MediaBlockContents | MediaBlockRelations;

const relationKinds = ['event', 'person', 'project', 'organization'];

export function parseMediaBlock(data: ApiData, assocs: ApiAssocs): MediaBlock {
  
  if (data.kind === 'selected_content') {
    return {
      ...parseMediaBlockBase(data, assocs),
      contentIds: [],
      // contentIds: getAssocs(assocs, 'contents', data.content_ids),
    };
  }
  
  if (relationKinds.includes(data.kind)) {
    return {
      ...parseMediaBlockBase(data, assocs),
      profileIDs: [],
      // profileIDs: getAssocs(assocs, 'profiles', data.profile_ids),
    };
  }
  
  throw new Error(`Unknown media block kind: ${data.kind}`);
}

function parseMediaBlockBase(data: ApiData, assocs: ApiAssocs): MediaBlockBase {
  return {
    id: data.id,
    profileTypeId: data.profile_type_id,
    layout: data.layout,
    kind: data.kind,
    blockTypeID: data.block_type_id,
    localized: {
      locale: data.localized.locale,
      name: data.localized.name,
    },
    updatedAt: data.updated_at,
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
