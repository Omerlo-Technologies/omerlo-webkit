import type { Category } from './categories';
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { requestPublisher } from '../utils/request';

export const personFetchers = (f: typeof fetch) => {
  return {
    getPerson: getPerson(f),
    listPersons: listPersons(f)
  };
};

export interface PersonSummary {
  id: string;
  profileTypeID: string;
  kind: string;
  firstName: string;
  lastName: string;
  otherName: string | null;
  pronouns: string | null;
  avatarImageURL: string | null;
  localized: {
    locale: string;
    summaryHtml: string;
    summaryText: string;
  };
  updatedAt: string;
}

export function parsePersonSummary(data: ApiData, _assocs: ApiAssocs): PersonSummary {
  return {
    id: data.id,
    profileTypeID: data.profile_type_id,
    kind: 'person',
    firstName: data.first_name,
    lastName: data.last_name,
    otherName: data.other_name,
    pronouns: data.pronoun,
    avatarImageURL: data.avatar_image_url,
    localized: data.localized,
    updatedAt: data.updated_at
  };
}

export interface Person extends PersonSummary {
  coverImageURL: string | null;
  categories: Category[] | null;
  localizedAddress: null;
  localizedContact: null;
  localizedDescription: null;
}

export function parsePerson(data: ApiData, assocs: ApiAssocs): Person {
  return {
    ...parsePersonSummary(data, assocs),
    coverImageURL: data.cover_image_url,
    categories: null,
    //categories: getAssocs<Category>(assocs, 'categories', data.categories),
    localizedAddress: data.localized_address,
    localizedContact: data.localized_contact,
    localizedDescription: data.localized_description
  };
}

export function getPerson(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parsePerson };
    return requestPublisher(f, `/people/${id}`, opts);
  };
}

export function listPersons(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const queryParams = params;
    const opts = { parser: parseMany(parsePersonSummary), queryParams };
    return requestPublisher(f, `/people`, opts);
  };
}
