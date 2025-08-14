import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { getAssoc } from '$reader/utils/assocs';
import { parseDate } from '$reader/utils/parseHelpers';
import { request } from '$reader/utils/request';
import type { Issue } from './magazines';

export const distributionFetchers = (f: typeof fetch) => {
  return {
    listReleases: releasesFetcher(f)
  };
};

export function releasesFetcher(f: typeof fetch) {
  return async (distributionId: string, params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseRelease), queryParams: params };
    return request(f, `/distributions/${distributionId}/releases`, opts);
  };
}

export interface Release {
  id: string;
  issue: Issue;
  startsAt: Date;
  endsAt: Date | null;
  updatedAt: Date;
}

export function parseRelease(data: ApiData, assocs: ApiAssocs): Release {
  return {
    id: data.id,
    issue: getAssoc<Issue>(assocs, 'issues', data.issue_id),
    // isPublished: data.is_published,
    startsAt: new Date(data.starts_at),
    endsAt: parseDate(data.ends_at),
    updatedAt: new Date(data.updated_at)
  };
}
