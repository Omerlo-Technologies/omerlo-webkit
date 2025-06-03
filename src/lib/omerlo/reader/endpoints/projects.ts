import type { ApiAssocs } from '../utils/api';
import { type ApiData, parseMany, type PagingParams } from '../utils/api';
import { getAssocs } from '../utils/assocs';
import { requestPublisher } from '../utils/request';
import type { LocalesMetadata } from '../utils/response';
import type { Category } from './categories';
import { parseProfileAddress, type ProfileAddress } from './profiles';

export const projectFetchers = (f: typeof fetch) => {
  return {
    listProjects: listProjects(f),
    getProject: getProject(f)
  };
};

export interface ProjectSummary {
  id: string;
  profileTypeId: string;
  kind: string;
  logoImgUrl: string | null;
  meta : {
    locales: LocalesMetadata;
  };
  name: string;
  summaryHtml: string | null;
  summaryText: string | null;
  updatedAt: Date;
}

export function parseProjectSummary(data: ApiData, _assocs: ApiAssocs): ProjectSummary {
  return {
    id: data.id,
    profileTypeId: data.profile_type_id,
    kind: 'Project',
    logoImgUrl: data.logo_image_url,
    meta: {
      locales: {
        available: [data.localized.locale],
        current: data.localized.locale
      }
    },
    name: data.localized.name,
    summaryHtml: data.localized.summary_html,
    summaryText: data.localized.summary_text,
    updatedAt: new Date(data.updated_at),
  };
}

export interface Project extends ProjectSummary {
  coverImgUrl: string | null;
  categories: Category[];
  contact: unknown;
  address: ProfileAddress | null;
  description: unknown;
}

export function parseProject(data: ApiData, assocs: ApiAssocs): Project {
  const address = data.localized_address
   ? parseProfileAddress(data.localized_address, assocs)
    : null;

  return {
    ...parseProjectSummary(data, assocs),
    coverImgUrl: data.cover_image_url,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    contact: null,
    address,
    description: null,
  };
}

export function getProject(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseProject };
    return requestPublisher(f, `/projects/${id}`, opts);
  };
}

export function listProjects(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const queryParams = params;
    const opts = { parser: parseMany(parseProjectSummary), queryParams };
    return requestPublisher(f, `/projects`, opts);
  };
}
