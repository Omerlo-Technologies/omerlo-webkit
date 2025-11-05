import {
  parseMany,
  type ApiAssocs,
  type ApiData,
  type ApiParams,
  type PagingParams
} from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '$reader/utils/request';

export const webpageFetchers = (f: typeof fetch) => {
  return {
    listWebpages: listWebpages(f),
    getWebpage: getWebpage(f)
  };
};

export function listWebpages(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseWebpageSummary), queryParams: params };
    return requestPublisher(f, `organization/pages`, opts);
  };
}

export function getWebpage(f: typeof fetch) {
  return async (slug: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseWebpage, queryParams: params };
    return requestPublisher(f, `organization/pages/${slug}`, opts);
  };
}

export interface WebpageSummary {
  id: string;
  name: string;
  type: string;
  useDefaultLayout: boolean;
  seoEnabled: boolean;
  meta: {
    locales: LocalesMetadata;
  };
  title: string;
  slug: string;
  url: string | null;
}

export interface OrgWebpage extends WebpageSummary {
  html: string;
}

export function parseWebpageSummary(data: ApiData, _assocs: ApiAssocs): WebpageSummary {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    useDefaultLayout: data.use_default_layout,
    seoEnabled: data.seo_enabled,
    meta: buildMeta(data.localized.locale),
    title: data.localized.title,
    slug: data.localized.slug,
    url: data.localized.url
  };
}

export function parseWebpage(data: ApiData, assocs: ApiAssocs): OrgWebpage {
  return {
    ...parseWebpageSummary(data, assocs),
    html: data.localized.html
  };
}
