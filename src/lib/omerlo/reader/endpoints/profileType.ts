import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '$reader/utils/request';

export const profileTypeFetchers = (f: typeof fetch) => {
  return {
    listProfileTypes: listProfileTypes(f),
    getProfileType: getProfileType(f)
  };
};

export function listProfileTypes(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseProfileTypeSummary), queryParams: params };
    return requestPublisher(f, `media/profile-types`, opts);
  };
}

export function getProfileType(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseProfileType };
    return requestPublisher(f, `media/profile-types/${id}`, opts);
  };
}

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
  let localizedField: { name: string; meta: { locales: LocalesMetadata } };

  // NOTE: This is to support publisher public api v2
  if (data.localized) {
    localizedField = { name: data.localized.name, meta: buildMeta(data.localized.locale) };
  } else {
    localizedField = { name: data.name, meta: { locales: parseLocalesMetadata(data.meta) } };
  }

  return {
    ...localizedField,
    id: data.id,
    kind: data.kind,
    key: data.key,
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
