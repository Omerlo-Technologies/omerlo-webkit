import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import { parseDate } from '$reader/utils/parseHelpers';

export const publicationFetchers = (f: typeof fetch) => {
  return {
    listPublications: listPublications(f)
  };
};

export interface Publication {
  id: string;
  content: string;
  section: string;
  feedType: string;
  startsAt: Date;
  endsAt: Date | null;
}

export function parsePublication(data: ApiData, _assocs: ApiAssocs): Publication {
  console.log('parsePublication', data);
  return {
    id: data.id,
    content: data.content_id,
    section: data.section_id,
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
