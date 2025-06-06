import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import { getAssocs } from '$reader/utils/assocs';
import { parseDate } from '$reader/utils/parseHelpers';
import { type Content } from './contents';

export const publicationFetchers = (f: typeof fetch) => {
  return {
    listPublications: listPublications(f)
  };
};

export interface Publication {
  id: string;
  content: Content[];
  //   section: Section[];
  feedType: string;
  startsAt: Date;
  endsAt: Date | null;
}

export function parsePublication(data: ApiData, assocs: ApiAssocs): Publication {
  const content = data.content_ids
      ? getAssocs<Content>(assocs, 'contents', data.content_ids)
      : [];
  return {
    id: data.id,
    content,
    // section:
    feedType: data.feed_type,
    startsAt: new Date(data.starts_at),
    endsAt: parseDate(data.ends_at)
  };
}

export interface PublicationParams extends PagingParams {
  content_id: string;
}

export function listPublications(f: typeof fetch) {
  return async (params: PublicationParams) => {
    const opts = { parser: parseMany(parsePublication), queryParams: params };
    return requestPublisher(f, `/publications`, opts);
  };
}
