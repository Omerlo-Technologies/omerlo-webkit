import type { Category } from './categories';
import { type ApiAssocs, type ApiData } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import {
  parseProfileAddress,
  type ProfileAddress,
  parseProfileContact,
  type ProfileContact,
  parseProfileDescription,
  type ProfileDescription
} from './profiles';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import type { ProfileType } from './profileType';
import { buildMeta } from '$reader/utils/parseHelpers';

export interface PersonSummary {
  id: string;
  profileType: ProfileType;
  kind: string;
  firstName: string;
  lastName: string;
  otherName: string | null;
  pronoun: string | null;
  profileImageURL: string | null;
  coverImageURL: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  summaryHtml: string | null;
  summaryText: string | null;
  updatedAt: Date;
}

export function parsePersonSummary(data: ApiData, assocs: ApiAssocs): PersonSummary {
  return {
    id: data.id,
    profileType: getAssoc<ProfileType>(assocs, 'profile_types', data.profile_type_id),
    kind: 'person',
    firstName: data.first_name,
    lastName: data.last_name,
    otherName: data.other_name,
    pronoun: data.pronoun,
    // NOTE remove logo_image_url once using reader api
    profileImageURL: data.avatar_image_url || data.profile_image_url,
    coverImageURL: data.cover_image_url,
    meta: buildMeta(data.localized?.locale),
    summaryHtml: data.localized?.summary_html,
    summaryText: data.localized?.summary_text,
    updatedAt: new Date(data.updated_at)
  };
}

export interface Person extends PersonSummary {
  categories: Category[];
  address: ProfileAddress | null;
  contact: ProfileContact | null;
  description: ProfileDescription | null;
}

export function parsePerson(data: ApiData, assocs: ApiAssocs): Person {
  const address = data.localized_address
    ? parseProfileAddress(data.localized_address, assocs)
    : null;
  const contact = data.localized_contact
    ? parseProfileContact(data.localized_contact, assocs)
    : null;
  const description = data.localized_description
    ? parseProfileDescription(data.localized_description, assocs)
    : null;

  return {
    ...parsePersonSummary(data, assocs),
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    address,
    contact,
    description
  };
}
