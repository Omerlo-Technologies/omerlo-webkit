import type { ApiAssocs, PagingParams } from '$reader/utils/api';
import { parseMany, type ApiData } from '$reader/utils/api';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import type { LocalesMetadata } from '$reader/utils/response';
import type { Category } from './categories';
import { parseProfileAddress, type ProfileAddress } from './profiles';
import { parseProfileContact, type ProfileContact } from './profiles';
import { parseProfileDescription, type ProfileDescription } from './profiles';
import type { ProfileType } from './profileType';
import { buildMeta } from '$reader/utils/parseHelpers';
import { ParseWebpage, ParseWebpageSummary } from './webpage';
import { requestPublisher } from '$reader/utils/request';

export const organizationFetchers = (f: typeof fetch) => {
  return {
    listOrganizations: listOrganizations(f),
    getOrganization: getOrganization(f),
    getOrgWebpage: getOrgWebpage(f),
    listOrgWebpages: listOrgWebpages(f)
  };
};

export interface OrganizationSummary {
  id: string;
  profileType: ProfileType;
  kind: string;
  name: string;
  profileImageURL: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  summaryHtml: string | null;
  summaryText: string | null;
  updatedAt: Date;
}

export interface Organization extends OrganizationSummary {
  coverImageUrl: string | null;
  categories: Category[];
  contact: ProfileContact | null;
  address: ProfileAddress | null;
  description: ProfileDescription | null;
}

export function parseOrganizationSummary(data: ApiData, assocs: ApiAssocs): OrganizationSummary {
  return {
    id: data.id,
    profileType: getAssoc<ProfileType>(assocs, 'profile_types', data.profile_type_id),
    kind: 'organization',
    name: data.name,
    profileImageURL: data.logo_image_url,
    meta: buildMeta(data.localized.locale),
    summaryHtml: data.localized.summary_html,
    summaryText: data.localized.summary_text,
    updatedAt: new Date(data.updated_at)
  };
}

export function parseOrganization(data: ApiData, assocs: ApiAssocs): Organization {
  const contact = data.localized.contact
    ? parseProfileContact(data.localized.contact, assocs)
    : null;
  const address = data.localized_address
    ? parseProfileAddress(data.localized_address, assocs)
    : null;
  const description = data.localized.description
    ? parseProfileDescription(data.localized.description, assocs)
    : null;

  return {
    ...parseOrganizationSummary(data, assocs),
    coverImageUrl: data.cover_image_url,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    contact,
    address,
    description
  };
}

export function getOrganization(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseOrganization };
    return requestPublisher(f, `organization`, opts);
  };
}

export function listOrganizations(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseOrganizationSummary), queryParams: params };
    return requestPublisher(f, `organizations`, opts);
  };
}

export function getOrgWebpage(f: typeof fetch) {
  return async (slug: string) => {
    const opts = { parser: ParseWebpage };
    return requestPublisher(f, `organization/pages/${slug}`, opts);
  };
}

export function listOrgWebpages(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(ParseWebpageSummary), queryParams: params };
    return requestPublisher(f, `organization/pages`, opts);
  };
}
