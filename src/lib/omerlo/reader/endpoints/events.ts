import type { Category } from './categories';
import { parseMany, type ApiAssocs, type ApiData, type ApiParams } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import type { ProfileType } from './profile-types';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import {
  parseProfileAddress,
  parseProfileBlock,
  parseProfileContact,
  parseProfileDescription
} from './profiles';
import type {
  ListProfilesParams,
  ProfileAddress,
  ProfileContact,
  ProfileDescription
} from './profiles';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '$reader/utils/request';

export const eventFetchers = (f: typeof fetch) => {
  return {
    // TODO missing searchEvents
    // searchEvents: searchEvents(f)
    listEvents: listEvents(f),
    // TODO missing eventsByRange
    // eventsByRange: eventsByRange(f)
    getEvent: getEvent(f),
    allEventBlocks: allEventBlocks(f)
  };
};

export interface ListEventsParams extends ListProfilesParams {
  from?: string;
  to?: string;
  timezone?: string;
}

export function listEvents(f: typeof fetch) {
  return async (params?: Partial<ListEventsParams>) => {
    const opts = { parser: parseMany(parseEventSummary), queryParams: params };
    return requestPublisher(f, `media/events`, opts);
  };
}

export interface GetEventParams extends ApiParams {
  date?: string;
  timezone?: string;
}

export function getEvent(f: typeof fetch) {
  return async (id: string, params?: Partial<GetEventParams>) => {
    const opts = { parser: parseEvent, queryParams: params };
    return requestPublisher(f, `media/events/${id}`, opts);
  };
}

export function allEventBlocks(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
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
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  subscriptionUrl: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  name: string | null;
  summaryHtml: string | null;
  summaryText: string | null;
  startsAt: Date;
  endsAt: Date;
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
    profileImageUrl: data.logo_image_url || data.profile_image_url,
    coverImageUrl: data.cover_image_url,
    subscriptionUrl: data.subscription_url,
    name,
    summaryHtml,
    summaryText,
    meta: buildMeta(data.localized?.locale),
    startsAt: new Date(data.starts_at),
    endsAt: new Date(data.ends_at),
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
