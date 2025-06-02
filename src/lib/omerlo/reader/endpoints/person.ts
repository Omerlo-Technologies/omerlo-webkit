import type { Category } from './categories';
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { requestPublisher } from '../utils/request';
import type { LocalesMetadata } from '$reader/utils/response';
import { parseProfileAddress, type ProfileAddress } from './profiles';
import { getAssocs } from '../utils/assocs';

export const personFetchers = (f: typeof fetch) => {
  return {
    getPerson: getPerson(f),
    listPersons: listPersons(f)
  };
};

export interface PersonSummary {
  id: string;
  //profileType: string;
  kind: string;
  firstName: string;
  lastName: string;
  otherName: string | null;
  pronoun: string | null;
  avatarImageURL: string | null;
  meta: {
      locales: LocalesMetadata;
    };
  summaryHtml: string | null;
  summaryText: string | null;
  updatedAt: Date;
}

export function parsePersonSummary(data: ApiData, _assocs: ApiAssocs): PersonSummary {
  return {
    id: data.id,
    //profileType: data.profile_type_id,
    kind: 'person',
    firstName: data.first_name,
    lastName: data.last_name,
    otherName: data.other_name,
    pronoun: data.pronoun,
    avatarImageURL: data.avatar_image_url,
    meta: {
      locales: {
        available: [data.localized.locale],
        current: data.localized.locale
      }
    },
    summaryHtml: data.localized.summary_html,
    summaryText: data.localized.summary_text,
    updatedAt: new Date(data.updated_at)
  };
}

export interface Person extends PersonSummary {
  categories: Category[];
  address: ProfileAddress | null;
  contact: unknown;
  description: unknown;
}

export function parsePerson(data: ApiData, assocs: ApiAssocs): Person {
  const address = data.localized_address
    ? parseProfileAddress(data.localized_address, assocs)
    : null;

  return {
    ...parsePersonSummary(data, assocs),
    categories: getAssocs<Category>(assocs,'categories', data.categories_ids),
    address,
    contact: null,
    description: null,
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
