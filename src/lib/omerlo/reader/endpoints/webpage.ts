import { type ApiAssocs, type ApiData } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import { buildMeta } from '$reader/utils/parseHelpers';

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

export function ParseWebpageSummary(data: ApiData, _assocs: ApiAssocs): WebpageSummary {
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

export function ParseWebpage(data: ApiData, assocs: ApiAssocs): OrgWebpage {
  return {
    ...ParseWebpageSummary(data, assocs),
    html: data.localized.html
  };
}
