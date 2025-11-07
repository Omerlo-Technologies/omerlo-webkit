import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { getAssoc } from '$reader/utils/assocs';
import { buildMeta, parseDate } from '$reader/utils/parseHelpers';
import { request } from '$reader/utils/request';
import type { LocalesMetadata } from '$reader/utils/response';
import { parseIssueSummary, type IssueSummary } from './magazines';
import { parseVisual, type Visual } from './visuals';

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
  issue: IssueSummary;
  startsAt: Date;
  endsAt: Date | null;
}

export function parseRelease(data: ApiData, assocs: ApiAssocs): Release {
  let issue: IssueSummary;

  // NOTE for retro compatibility
  if (data.issue) {
    issue = parseIssueSummary(data.issue, assocs);
  } else {
    issue = getAssoc<IssueSummary>(assocs, 'issues', data.issue_id);
  }

  return {
    id: data.id,
    issue: issue,
    startsAt: new Date(data.starts_at),
    endsAt: parseDate(data.ends_at)
  };
}

export interface Distribution {
  id: string;
  meta: { locales: LocalesMetadata };
  name: string;
  visual: Visual | null;
  metadata: Record<string, string>;
}

export function parseDistribution(data: ApiData, assocs: ApiAssocs): Distribution {
  // NOTE for retro compatibility

  if (data.localized !== undefined) {
    return {
      id: data.id,
      meta: buildMeta(data.localized?.locale || null),
      metadata: data.metadata,
      name: data.localized?.name || null,
      visual: parseVisual(data.visual, assocs)
    };
  } else {
    throw "missing parser for distribution for reader's api";
  }
}
