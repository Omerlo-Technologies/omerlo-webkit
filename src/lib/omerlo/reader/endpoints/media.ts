import type { ApiAssocs } from '../utils/api';
import type { ApiData } from '../utils/api';
import { requestPublisher } from '../utils/request';
import type { LocalesMetadata } from '../utils/response';
import { parseVisual, type Visual } from './visuals';
import { buildMeta } from '../utils/parseHelpers';

export const mediaFetchers = (f: typeof fetch) => {
  return {
    getMedia: getMedia(f),
    getMediaSection: getMediaSection(f),
    getMediaBlock: getMediaBlock(f)
  };
};

export function getMedia(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseMedia };
    // NOTE the `/` is REALLY important
    return requestPublisher(f, 'media/', opts);
  };
}

export function getMediaSection(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseSection };
    return requestPublisher(f, `/sections/${id}`, opts);
  };
}

export function getMediaBlock(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseBlock };
    return requestPublisher(f, `/blocks/${id}`, opts);
  };
}

export interface Media {
  id: string;
  displayName: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  name: string;
  key: string;
  contact: MediaContact | null;
  sections: MediaSectionHierarchy[];
  metadata: Record<string, string>;
  updatedAt: Date;
}

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

export interface MediaSectionSummary {
  id: string;
  name: string;
  slug: string;
  visual: Visual | null;
  meta: {
    locales: LocalesMetadata;
  };
  color: string;
  updatedAt: Date;
}

export interface MediaSectionHierarchy extends MediaSectionSummary {
  sections: MediaSectionSummary[];
}

export interface MediaSection extends MediaSectionSummary {
  description: string | null;
  advertisingKey: string | null;
  sections: MediaSectionSummary[];
  blocks: MediaBlockSummary[];
}

export interface MediaBlockConfigurationSummary {
  id: string;
  type: 'content' | 'distribution' | 'html' | 'media' | 'most_popular' | 'section';
  name: string;
  key: string;
}

export interface MediaBlockSummary {
  id: string;
  // NOTE we can't use those field for the moment because we depends of publisher api
  // Reader API isn't ready for now
  //
  // configuration: MediaBlockConfigurationSummary;
  // name: string;
  // description: string | null;
  // html: string | null;
  // visual: Visual | null;
  // meta: {
  //   locales: LocalesMetadata;
  // };
  // textColor: string | null;
  // backgroundColor: string | null;
  // backgroundSVG: string | null;
  // updatedAt: Date;
}

export interface MediaBlock extends MediaBlockSummary {
  name: string;
}

export function parseMedia(data: ApiData, assocs: ApiAssocs): Media {
  const contact = data.localized_contact ? parseMediaContact(data.localized_contact, assocs) : null;

  return {
    id: data.id,
    displayName: data.localized?.display_name,
    meta: buildMeta(data.localized?.locale),
    name: data.name,
    key: data.key,
    contact,
    metadata: data.metadata,
    sections: data.sections.map((section: ApiData, assocs: ApiAssocs) =>
      parseSectionHierarchy(section, assocs)
    ),
    updatedAt: data.updated_at
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

function parseSection(data: ApiData, assocs: ApiAssocs): MediaSection {
  return {
    id: data.id,
    name: data.localized.name,
    description: data.localized.description,
    slug: data.localized.slug,
    visual: parseVisual(data.visual, assocs),
    meta: buildMeta(data.localized.locale),
    color: data.color,
    advertisingKey: data.advertising_key,
    sections: data.sections.map((section: ApiData) => parseSectionSummary(section, assocs)),
    blocks: data.blocks.map((block: ApiData, assocs: ApiAssocs) =>
      parseBlockSummary(block, assocs)
    ),
    updatedAt: data.updated_at
  };
}

function parseSectionSummary(data: ApiData, assocs: ApiAssocs): MediaSectionSummary {
  return {
    id: data.id,
    color: data.color,
    meta: buildMeta(data.localized.locale),
    name: data.localized.name,
    slug: data.localized.slug,
    visual: parseVisual(data.visual, assocs),
    updatedAt: data.updated_at
  };
}

function parseSectionHierarchy(data: ApiData, assocs: ApiAssocs): MediaSectionHierarchy {
  return {
    ...parseSectionSummary(data, assocs),
    sections: data.sections.map((section: ApiData) => parseSectionHierarchy(section, assocs))
  };
}

export function parseMediaBlockConfiguration(data: ApiData): MediaBlockConfigurationSummary {
  return {
    id: data.id,
    type: data.block_type,
    name: data.name,
    key: data.key
  };
}

function parseBlockSummary(data: ApiData, _assocs: ApiAssocs): MediaBlockSummary {
  return {
    id: data.id
  };
}

function parseBlock(data: ApiData, assocs: ApiAssocs): MediaBlock {
  return {
    ...parseBlockSummary(data, assocs),
    name: data.localized.name
    // configuration: getAssoc<MediaBlockConfigurationSummary>(
    //   assocs,
    //   'media_block_configurations',
    //   data.configuration_id
    // ),
    // name: data.localized.name,
    // description: data.localized.description,
    // html: data.localized.html,
    // visual: data.localized.visual,
    // meta: buildMeta(data.localized.locale),
    // textColor: data.textColor,
    // backgroundColor: data.backgroundColor,
    // backgroundSVG: data.backgroundSVG,
    // updatedAt: data.updatedAt
  };
}
