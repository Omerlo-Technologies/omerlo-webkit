import type { Category } from './categories';
import { parseMany, type ApiAssocs, type ApiData, type ApiParams } from '$reader/utils/api';
import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import {
  parseProfileAddress,
  parseProfileBlock,
  type ListProfilesParams,
  type ProfileAddress
} from './profiles';
import { parseProfileContact, type ProfileContact } from './profiles';
import { parseProfileDescription, type ProfileDescription } from './profiles';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import type { ProfileType } from './profile-types';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '$reader/utils/request';

export const personFetchers = (f: typeof fetch) => {
  return {
    // TODO missing searchPeople
    // searchPeople: searchPeople(f)
    listPeople: listPeople(f),
    getPerson: getPerson(f),
    allPersonBlocks: allPersonBlocks(f)
  };
};

export function listPeople(f: typeof fetch) {
  return async (params?: Partial<ListProfilesParams>) => {
    const opts = { parser: parseMany(parsePersonSummary), queryParams: params };
    return requestPublisher(f, `media/people`, opts);
  };
}

export function getPerson(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parsePerson, queryParams: params };
    return requestPublisher(f, `media/people/${id}`, opts);
  };
}

export function allPersonBlocks(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseMany(parseProfileBlock), queryParams: params };
    return requestPublisher(f, `media/people/${id}/blocks`, opts);
  };
}

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
  let localizedField: {
    summaryHtml: string;
    summaryText: string;
    meta: { locales: LocalesMetadata };
  };

  // NOTE: This is to support publisher public api v2
  if (data.localized !== undefined) {
    localizedField = {
      summaryHtml: data.localized?.summary_html || null,
      summaryText: data.localized?.summary_text || null,
      meta: buildMeta(data.localized?.locale || null)
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
    kind: 'person',
    firstName: data.first_name,
    lastName: data.last_name,
    otherName: data.other_name,
    pronoun: data.pronoun,
    // NOTE remove logo_image_url once using reader api
    profileImageURL: data.avatar_image_url || data.profile_image_url,
    coverImageURL: data.cover_image_url,
    ...localizedField,
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
