import type { ApiAssocs } from '../utils/api';
import { type ApiData } from '../utils/api';
import { requestPublisher } from '../utils/request';
import type { LocalesMetadata } from '../utils/response';
import { parseVisual, type Visual } from './visuals';
import { buildMeta } from '../utils/parseHelpers';

export const mediaFetchers = (f: typeof fetch) => {
  return {
    getMedia: getMedia(f)
  };
};

export interface MediaSummary {
  id: string;
  organization: string;
  name: string;
  key: string;
  sections: Section[];
}

export interface Media extends MediaSummary {
  contact: MediaContact | null;
}

export type Section = {
  id: string;
  color: string;
  position: number;
  meta: {
    locales: LocalesMetadata;
  };
  name: string;
  slug: string;
  visual: Visual;
};

export interface MediaContact {
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  youtube: string | null;
  instagram: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  meta: {
    locales: LocalesMetadata;
  };
}

function parseMediaContact(data: ApiData, _assocs: ApiAssocs): MediaContact {
  return {
    phone: data.phone,
    email: data.email,
    linkedin: data.linkedin,
    website: data.website,
    facebook: data.facebook,
    twitter: data.twitter,
    instagram: data.instagram,
    youtube: data.youtube,
    meta: buildMeta(data.locale)
  };
}

export function parseMedia(data: ApiData, assocs: ApiAssocs): Media {
  const contact = data.localized_contact ? parseMediaContact(data.localized_contact, assocs) : null;

  return {
    id: data.id,
    organization: data.organization_id,
    name: data.name,
    key: data.key,
    sections: parseSections(data, assocs),
    contact
  };
}

function parseSections(data: ApiData, assocs: ApiAssocs): Section[] {
  return data.sections.map((section: ApiData) => ({
    id: section.id,
    color: section.color,
    position: section.position,
    meta: buildMeta(section.localized.locale),
    name: section.localized.name,
    slug: section.localized.slug,
    visual: parseVisual(section.visual, assocs)
  }));
}

export function getMedia(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseMedia };
    return requestPublisher(f, '/', opts);
  };
}
