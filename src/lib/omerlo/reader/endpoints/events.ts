import type { Category } from "./categories";
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from "$reader/utils/api";
import { getAssoc, getAssocs } from "../utils/assocs";
import { requestPublisher } from "../utils/request";


export const eventFetchers= (f: typeof fetch) => {
  return {
    getEvent: getEvent(f),
    listEvents: listEvents(f)
  }
}

export interface EventSummary {
  id: string;
  profileTypeID: string;
  kind : string,
  type: string;
  isAllDay: boolean;
  logoImageURL: string | null;
  subscriptionURL: string | null;
  localized: {
    locale: string;
    name: string;
    summaryHtml: string | null;
    summaryText: string | null;
  }
  startsAt: Date | null;
  endsAt: Date | null;
  updatedAt: Date;
}

export interface Event extends EventSummary {
  coverImageURL: string | null;
  categories: Category[];
  localizedAddress: string | null;
  localizedContact: string | null;
  localizedDescription: string | null;
}

export function parseEventSummary(data: ApiData, assocs: ApiAssocs): EventSummary {
  return {
    id: data.id,
    profileTypeID: data.profile_type_id,
    kind: 'event',
    type: data.type,
    isAllDay: data.is_all_day,
    logoImageURL: data.logo_image_url || null,
    subscriptionURL: data.subscription_url || null,
    localized: data.localized,
    startsAt: new Date(data.starts_at),
    endsAt: new Date(data.ends_at),
    updatedAt: new Date(data.updated_at),
  };
}

export function parseEvent(data: ApiData, assocs: ApiAssocs): Event {
  return {
    ...parseEventSummary(data, assocs),
    coverImageURL: data.cover_image_url || null,
    categories: [],
    // categories: getAssocs<Category>(assocs, 'categories', data.categories),
    localizedAddress: data.localized_address, //ProfileAddress
    localizedContact: data.localized_contact, //ProfileContact
    localizedDescription: data.localized_description, //ProfileDescription
  }
}

export function getEvent(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseEvent };
    return requestPublisher(f, `/events/${id}`, opts);
  }
}

export function listEvents(f: typeof fetch) {
    return async (params?: Partial<PagingParams>) => {
        const queryParams = params;
        const opts = { parser: parseMany(parseEventSummary), queryParams};
        return requestPublisher(f, `/events`, opts);
    };
}
