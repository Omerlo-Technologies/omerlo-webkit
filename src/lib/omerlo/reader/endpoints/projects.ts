import type { LocalesMetadata } from '$reader/utils/response';
import type { Category } from './categories';
import {
  parseProfileAddress,
  type ProfileAddress,
  parseProfileContact,
  type ProfileContact,
  parseProfileDescription,
  type ProfileDescription
} from './profiles';
import {
  type ApiData,
  type ApiAssocs,
  parseMany,
  type PagingParams,
  type ApiParams
} from '$reader/utils/api';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import { buildMeta } from '$reader/utils/parseHelpers';
import type { ProfileType } from './profileType';
import { requestPublisher } from '$reader/utils/request';

export const projectFetchers = (f: typeof fetch) => {
  return {
    listProjects: listProjects(f),
    getProject: getProject(f)
    // TODO missing allProjectBlocks
    // allProjectBlocks: allProjectBlocks(f)
  };
};

export function listProjects(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseProjectSummary), queryParams: params };
    return requestPublisher(f, `media/projects`, opts);
  };
}

export function getProject(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseProject, queryParams: params };
    return requestPublisher(f, `media/projects/${id}`, opts);
  };
}

export interface ProjectSummary {
  id: string;
  profileType: ProfileType;
  kind: string;
  profileImageURL: string | null;
  coverImageURL: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  name: string;
  summaryHtml: string | null;
  summaryText: string | null;
  updatedAt: Date;
}

export function parseProjectSummary(data: ApiData, assocs: ApiAssocs): ProjectSummary {
  return {
    id: data.id,
    profileType: getAssoc<ProfileType>(assocs, 'profile_types', data.profile_type_id),
    kind: 'project',
    // NOTE remove logo_image_url once using reader api
    profileImageURL: data.logo_image_url || data.profile_image_url,
    coverImageURL: data.cover_image_url,
    meta: buildMeta(data.localized?.locale),
    name: data.localized?.name,
    summaryHtml: data.localized?.summary_html,
    summaryText: data.localized?.summary_text,
    updatedAt: new Date(data.updated_at)
  };
}

export interface Project extends ProjectSummary {
  coverImageUrl: string | null;
  categories: Category[];
  contact: ProfileContact | null;
  address: ProfileAddress | null;
  description: ProfileDescription | null;
}

export function parseProject(data: ApiData, assocs: ApiAssocs): Project {
  const contact = data.localized_contact
    ? parseProfileContact(data.localized_contact, assocs)
    : null;
  const address = data.localized_address
    ? parseProfileAddress(data.localized_address, assocs)
    : null;
  const description = data.localized_description
    ? parseProfileDescription(data.localized_description, assocs)
    : null;

  return {
    ...parseProjectSummary(data, assocs),
    coverImageUrl: data.cover_image_url,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    contact,
    address,
    description
  };
}
