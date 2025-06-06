import { type ApiAssocs, type ApiData, parseMany } from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import type { LocalesMetadata } from '$reader/utils/response';
import { type Organization } from './organizations';
import { parseVisual, type Visual } from './visuals';
import { buildMeta, parseDate } from '$reader/utils/parseHelpers';
import { getAssoc } from '$reader/utils/assocs';
import { parseContentSummary } from './contents';

export const issuesFetchers = (f: typeof fetch) => {
  return {
    getIssue: getIssue(f),
    listIssueContents: listIssueContents(f)
  };
};

export interface Issue extends IssueSummary {
  sections: IssueSummary[];
}

export interface IssueSummary {
  id: string;
  organization: Organization;
  issueType: string;
  pdfUrl: string | null;
  prices: string | null;
  publishedAt: Date | null;
  name: string;
  meta: {
    locales: LocalesMetadata;
  };
  visual: Visual | null;
  metadata: Record<string, string>;
}

export function listIssueContents(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseMany(parseContentSummary) };
    return requestPublisher(f, `issue/contents`, opts);
  };
}

export function getIssue(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseIssue };
    return requestPublisher(f, `issue/`, opts);
  };
}

export function parseIssue(data: ApiData, assocs: ApiAssocs): Issue {
  return {
    ...parseIssueSummary(data, assocs),
    sections: data.sections
      ? data.sections.map((section: string) => parseIssueSummary(section, assocs))
      : []
  };
}

export function parseIssueSummary(data: ApiData, assocs: ApiAssocs): IssueSummary {
  return {
    id: data.id,
    organization: getAssoc<Organization>(assocs, 'organizations', data.organization_id),
    issueType: data.issueType,
    pdfUrl: data.pdfUrl,
    prices: data.prices,
    publishedAt: parseDate(data.publishedAt),
    name: data.localized.name,
    meta: buildMeta(data.localized.locale),
    visual: parseVisual(data.visual, assocs),
    metadata: data.metadata
  };
}
