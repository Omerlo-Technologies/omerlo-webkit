import type { ApiAssocs } from '$reader/utils/api';
import { type ApiData } from '$reader/utils/api';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import type { LocalesMetadata } from '$reader/utils/response';
import type { Category } from './categories';
import { parseProfileAddress, type ProfileAddress } from './profiles';
import { parseProfileContact, type ProfileContact } from './profiles';
import { parseProfileDescription, type ProfileDescription } from './profiles';
import type { ProfileType } from './profileType';
import { buildMeta } from '$reader/utils/parseHelpers';

export interface OrganizationSummary {
  id: string;
  profileType: ProfileType;
  kind: string;
  name: string;
  logoImgURL: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  summaryHtml: string | null;
  summaryText: string | null;
  updatedAt: Date;
}

export interface Organization extends OrganizationSummary {
  coverImgURL: string | null;
  categories: Category[];
  contact: ProfileContact | null;
  address: ProfileAddress | null;
  description: ProfileDescription | null;
}

export function parseOrganizationSummary(data: ApiData, _assocs: ApiAssocs): OrganizationSummary {
  return {
    id: data.id,
    profileType: getAssoc<ProfileType>(_assocs, 'profile_types', data.profile_type_id),
    kind: 'organization',
    name: data.name,
    logoImgURL: data.logo_image_url,
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
    coverImgURL: data.cover_image_url,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    contact,
    address,
    description
  };
}
