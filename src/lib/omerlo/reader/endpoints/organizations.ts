import type { ApiAssocs, PagingParams } from '$reader/utils/api';
import { parseMany, type ApiData } from '$reader/utils/api';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import type { Category } from './categories';
import { parseProfileAddress, type ProfileAddress } from './profiles';
import { parseProfileContact, type ProfileContact } from './profiles';
import { parseProfileDescription, type ProfileDescription } from './profiles';
import type { ProfileType } from './profileType';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '$reader/utils/request';

export const organizationFetchers = (f: typeof fetch) => {
  return {
    listOrganizations: listOrganizations(f),
    getOrganization: getOrganization(f)
    // TODO missing allPersonBlocks
    // allOrganizationBlocks: allOrganizationBlocks(f)
  };
};

export function listOrganizations(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseOrganizationSummary), queryParams: params };
    return requestPublisher(f, `media/organizations`, opts);
  };
}

export function getOrganization(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseOrganization };
    return requestPublisher(f, `media/organizations/${id}`, opts);
  };
}

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
  let localizedField: {
    summaryHtml: string;
    summaryText: string;
    meta: { locales: LocalesMetadata };
  };

  // NOTE: This is to support publisher public api v2
  if (data.localized) {
    localizedField = {
      summaryHtml: data.localized.summary_html,
      summaryText: data.localized.summary_text,
      meta: buildMeta(data.localized.locale)
    };
  } else {
    localizedField = {
      summaryHtml: data.summary_html,
      summaryText: data.summary_text,
      meta: { locales: parseLocalesMetadata(data.meta) }
    };
  }

  return {
    id: data.id,
    profileType: getAssoc<ProfileType>(assocs, 'profile_types', data.profile_type_id),
    kind: 'organization',
    name: data.name,
    // NOTE remove logo_image_url once using reader api
    profileImageURL: data.logo_image_url || data.profile_image_url,
    ...localizedField,
    updatedAt: new Date(data.updated_at)
  };
}

export function parseOrganization(data: ApiData, assocs: ApiAssocs): Organization {
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
    ...parseOrganizationSummary(data, assocs),
    coverImageUrl: data.cover_image_url,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    contact,
    address,
    description
  };
}
