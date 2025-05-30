import { parsePersonSummary, type PersonSummary } from './person';
import { parseProjectSummary, type ProjectSummary } from './projects';
import { parseEventSummary, type EventSummary } from './events';
import type { ApiAssocs, ApiData } from '../utils/api';
import type { LocalesMetadata } from '../utils/response';

export type ProfileSummary = PersonSummary | ProjectSummary | EventSummary;
type ProfileKind = 'person' | 'project' | 'event';

const profileParser: Record<ProfileKind, (data: ApiData, _assocs: ApiAssocs) => ProfileSummary> = {
  person: parsePersonSummary,
  project: parseProjectSummary,
  event: parseEventSummary
  // TODO add organization
};
export function parseProfileSummary(data: ApiData, assocs: ApiAssocs): ProfileSummary {
  const parser = profileParser[data.kind as string as ProfileKind];
  return parser(data, assocs);
}

export interface ProfileAddress {
  state: string | null;
  location: string | null;
  city: string | null;
  country: string | null;
  street: string | null;
  meta: {
    locales: LocalesMetadata;
  };
}

export function parseProfileAddress(data: ApiData, _assocs: ApiAssocs): ProfileAddress {
  return {
    state: data.state,
    location: data.location,
    city: data.city,
    street: data.street,
    country: data.country,
    meta: {
      locales: {
        available: [data.locale],
        current: data.locale
      }
    }
  };
}
