import { type ApiAssocs, type ApiData } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import { buildMeta } from '$reader/utils/parseHelpers';


export interface ProfileTypeSummary {
  id: string;
  kind: 'person' | 'project' | 'organization' | 'event';
  key: string | null;
  name: string;
  meta: {
    locales: LocalesMetadata;
  };
  updatedAt: Date;
}

export function parseProfileTypeSummary(data: ApiData, _assocs: ApiAssocs): ProfileTypeSummary {
  return {
    id: data.id,
    kind: data.kind,
    key: data.key,
    name: data.localized.name,
    meta: buildMeta(data.localized.locale),
    updatedAt: new Date(data.updated_at)
  };
}

export interface ProfileType extends ProfileTypeSummary {
  hasPhone: boolean;
  hasEmail: boolean;
  hasLinkedIn: boolean;
  hasWebsite: boolean;
  hasTwitter: boolean;
  hasFacebook: boolean;
  hasBlueSky: boolean;
  hasCountry: boolean;
  hasState: boolean;
  hasCity: boolean;
  hasStreet: boolean;
}

export function parseProfileType(data: ApiData, assocs: ApiAssocs): ProfileType {
  return {
    ...parseProfileTypeSummary(data, assocs),
    hasPhone: data.has_phone || false,
    hasEmail: data.has_email || false,
    hasLinkedIn: data.has_linkedin || false,
    hasWebsite: data.has_website || false,
    hasTwitter: data.has_twitter || false,
    hasFacebook: data.has_facebook || false,
    hasBlueSky: data.has_bluesky || false,
    hasCountry: data.has_country || false,
    hasState: data.has_state || false,
    hasCity: data.has_city || false,
    hasStreet: data.has_street || false
  };
}
