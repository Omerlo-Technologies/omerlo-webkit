import type { Category } from './categories';
import {
  parseMany,
  type ApiAssocs,
  type ApiData,
  type ApiParams,
  type PagingParams
} from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import type { ProfileType } from './profileType';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import { parseDate } from '$reader/utils/parseHelpers';
import {
  parseProfileAddress,
  parseProfileBlock,
  parseProfileContact,
  parseProfileDescription
} from './profiles';
import type { ProfileAddress, ProfileContact, ProfileDescription } from './profiles';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '$reader/utils/request';

export const eventFetchers = (f: typeof fetch) => {
  return {
    listEvents: listEvents(f),
    getEvent: getEvent(f),
    allEventBlocks: allEventBlocks(f)
  };
};

export function listEvents(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseEventSummary), queryParams: params };
    return requestPublisher(f, `media/events`, opts);
  };
}

export function getEvent(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseEvent, queryParams: params };
    return requestPublisher(f, `media/events/${id}`, opts);
  };
}

export function allEventBlocks(f: typeof fetch) {
  return async (id: string, params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseProfileBlock), queryParams: params };
    return requestPublisher(f, `media/events/${id}/blocks`, opts);
  };
}

export interface EventSummary {
  id: string;
  profileType: ProfileType;
  kind: string;
  type: string;
  isAllDay: boolean;
  profileImageURL: string | null;
  coverImageURL: string | null;
  subscriptionURL: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  name: string | null;
  summaryHtml: string | null;
  summaryText: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  updatedAt: Date;
}

export interface Event extends EventSummary {
  categories: Category[];
  address: ProfileAddress | null;
  contact: ProfileContact | null;
  description: ProfileDescription | null;
}

export function parseEventSummary(data: ApiData, assocs: ApiAssocs): EventSummary {
  const name = data.localized?.name || null;
  const summaryHtml = data.localized?.summary_html || null;
  const summaryText = data.localized?.summary_text || null;
  return {
    id: data.id,
    profileType: getAssoc<ProfileType>(assocs, 'profile_types', data.profile_type_id),
    kind: 'event',
    type: data.type,
    isAllDay: data.is_all_day,
    // NOTE remove logo_image_url once using reader api
    profileImageURL: data.logo_image_url || data.profile_image_url,
    coverImageURL: data.cover_image_url,
    subscriptionURL: data.subscription_url,
    name,
    summaryHtml,
    summaryText,
    meta: buildMeta(data.localized?.locale),
    startsAt: parseDate(data.starts_at),
    endsAt: parseDate(data.ends_at),
    updatedAt: new Date(data.updated_at)
  };
}

export function parseEvent(data: ApiData, assocs: ApiAssocs): Event {
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
    ...parseEventSummary(data, assocs),
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    address,
    contact,
    description
  };
}
