import type { ApiAssocs } from '../utils/api';
import { type ApiData, parseMany, type PagingParams } from '../utils/api';
import { requestPublisher } from '../utils/request';

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
  localized: {
    locale: string;
    name: string;
    summaryHtml: string | null;
    summaryText: string | null;
  };
  updatedAt: string;
}

export function parseProjectSummary(data: ApiData, assocs: ApiAssocs): ProjectSummary {
  return {
    id: data.id,
    profileTypeId: data.profile_type_id,
    kind: 'Project',
    logoImgUrl: data.logo_image_url,
    localized: {
      locale: data.localized.locale,
      name: data.localized.name,
      summaryHtml: data.localized.summary_html,
      summaryText: data.localized.summary_text
    },
    updatedAt: data.updated_at
  };
}

export interface Project extends ProjectSummary {
  coverImgUrl: string | null;
  categories: null;
  localizedContact: null;
  localizedAddress: null;
  localizedDescription: null;
}

export function parseProject(data: ApiData, assocs: ApiAssocs): Project {
  return {
    ...parseProjectSummary(data, assocs),
    coverImgUrl: data.cover_image_url,
    categories: null,
    localizedContact: data.localized_contact,
    localizedAddress: data.localized_address,
    localizedDescription: data.localized_description
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
