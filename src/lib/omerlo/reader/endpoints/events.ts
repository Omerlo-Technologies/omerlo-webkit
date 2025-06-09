import type { Category } from './categories';
import { type ApiAssocs, type ApiData } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import type { ProfileType } from './profileType';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import { parseDate } from '$reader/utils/parseHelpers';
import {
  parseProfileAddress,
  parseProfileContact,
  parseProfileDescription
} from './profiles';
import type { ProfileAddress, ProfileContact, ProfileDescription } from './profiles';
import { buildMeta } from '$reader/utils/parseHelpers';

export interface EventSummary {
  id: string;
  profileType: ProfileType;
  kind: string;
  type: string;
  isAllDay: boolean;
  logoImageURL: string | null;
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
  coverImageURL: string | null;
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
    logoImageURL: data.logo_image_url || null,
    subscriptionURL: data.subscription_url || null,
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
    coverImageURL: data.cover_image_url || null,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    address,
    contact,
    description
  };
}
