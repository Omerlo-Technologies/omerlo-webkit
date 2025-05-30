import type { Category } from './categories';
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import type { LocalesMetadata } from '$reader/utils/response';
import { getAssocs } from '../utils/assocs';
import { parseProfileAddress, type ProfileAddress } from './profiles';

export const eventFetchers = (f: typeof fetch) => {
  return {
    getEvent: getEvent(f),
    listEvents: listEvents(f)
  };
};

export interface EventSummary {
  id: string;
  // profileType: string;
  kind: string;
  type: string;
  isAllDay: boolean;
  logoImageURL: string | null;
  subscriptionURL: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  name: string;
  summaryHtml: string | null;
  summaryText: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  updatedAt: Date;
}

export interface Event extends EventSummary {
  coverImageURL: string | null;
  categories: Category[];
  address: ProfileAddress | null;
  contact: unknown;
  description: unknown;
}

export function parseEventSummary(data: ApiData, _assocs: ApiAssocs): EventSummary {
  return {
    id: data.id,
    kind: 'event',
    type: data.type,
    isAllDay: data.is_all_day,
    logoImageURL: data.logo_image_url || null,
    subscriptionURL: data.subscription_url || null,
    name: data.localized.name,
    summaryHtml: data.localized.summary_html,
    summaryText: data.localized.summary_text,
    meta: {
      locales: {
        available: [data.localized.locale],
        current: data.localized.locale
      }
    },
    startsAt: new Date(data.starts_at),
    endsAt: new Date(data.ends_at),
    updatedAt: new Date(data.updated_at)
  };
}

export function parseEvent(data: ApiData, assocs: ApiAssocs): Event {
  const address = data.localized_address
    ? parseProfileAddress(data.localized_address, assocs)
    : null;

  return {
    ...parseEventSummary(data, assocs),
    coverImageURL: data.cover_image_url || null,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    address,
    contact: null,
    description: null
  };
}

export function getEvent(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseEvent };
    return requestPublisher(f, `/events/${id}`, opts);
  };
}

export function listEvents(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const queryParams = params;
    const opts = { parser: parseMany(parseEventSummary), queryParams };
    return requestPublisher(f, `/events`, opts);
  };
}
