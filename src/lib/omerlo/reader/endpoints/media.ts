import type { ApiAssocs, PagingParams } from '../utils/api';
import { parseMany, type ApiData } from '../utils/api';
import { request, requestPublisher } from '../utils/request';
import type { LocalesMetadata } from '../utils/response';
import { parseVisual, type Visual } from './visuals';
import { buildMeta } from '../utils/parseHelpers';
import { parseProfileType, parseProfileTypeSummary } from './profileType';
import { getAssoc } from '$reader/utils/assocs';

export const mediaFetchers = (f: typeof fetch) => {
  return {
    getMedia: getMedia(f),
    getMediaProfileType: getMediaProfileType(f),
    listMediaProfileTypes: listMediaProfileTypes(f),
    getMediaSection: getMediaSection(f)
  };
};

export interface Media {
  id: string;
  displayName: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  name: string;
  key: string;
  contact: MediaContact | null;
  sections: SectionSummary[];
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
    displayName: data.localized?.display_name,
    meta: buildMeta(data.localized?.locale),
    name: data.name,
    key: data.key,
    contact,
    metadata: data.metadata,
    sections: data.sections.map((section: ApiData, assocs: ApiAssocs) =>
      parseSectionSummary(section, assocs)
    ),
    updatedAt: data.updated_at
  };
}

export interface Section extends SectionSummary {
  description: string | null;
  parentId: string | null;
  advertisingKey: string | null;
  blocks: BlockSummary[];
}

function parseSection(data: ApiData, assocs: ApiAssocs): Section {
  return {
    id: data.id,
    parentId: data.parent_id,
    name: data.localized.name,
    description: data.localized.description,
    slug: data.localized.slug,
    visual: parseVisual(data.visual, assocs),
    meta: buildMeta(data.localized.locale),
    color: data.color,
    advertisingKey: data.advertising_key,
    blocks: data.blocks.map((block: ApiData, assocs: ApiAssocs) =>
      parseBlockSummary(block, assocs)
    ),
    updatedAt: data.updated_at
  };
}

export type SectionSummary = {
  id: string;
  name: string;
  slug: string;
  visual: Visual | null;
  meta: {
    locales: LocalesMetadata;
  };
  color: string;
  // SectionSummary exposes children `sections` on legacy API
  // See API documentation: https://b41758xgf4.apidog.io/media-by-id-18188200e0
  // sections: SectionSummary[];
  updatedAt: Date;
};

function parseSectionSummary(section: ApiData, assocs: ApiAssocs): SectionSummary {
  return {
    id: section.id,
    color: section.color,
    meta: buildMeta(section.localized.locale),
    name: section.localized.name,
    slug: section.localized.slug,
    visual: parseVisual(section.visual, assocs),
    updatedAt: section.updated_at
  };
}

export interface BlockConfigurationSummary {
  id: string;
  blockType: 'content' | 'distribution' | 'html' | 'media' | 'most_popular' | 'section';
  name: string;
  key: string;
}

export function parseMediaBlockConfiguration(data: ApiData): BlockConfigurationSummary {
  return {
    id: data.id,
    blockType: data.block_type,
    name: data.name,
    key: data.key
  };
}

export interface BlockSummary {
  id: string;
  configuration: BlockConfigurationSummary;
  name: string;
  description: string | null;
  html: string | null;
  visual: Visual | null;
  meta: {
    locales: LocalesMetadata;
  };
  textColor: string | null;
  backgroundColor: string | null;
  backgroundSVG: string | null;
  updatedAt: Date;
}

function parseBlockSummary(data: ApiData, assocs: ApiAssocs): BlockSummary {
  return {
    id: data.localized.id,
    configuration: getAssoc<BlockConfigurationSummary>(
      assocs,
      'media_block_configurations',
      data.configuration_id
    ),
    name: data.localized.name,
    description: data.localized.description,
    html: data.localized.html,
    visual: data.localized.visual,
    meta: buildMeta(data.localized.locale),
    textColor: data.textColor,
    backgroundColor: data.backgroundColor,
    backgroundSVG: data.backgroundSVG,
    updatedAt: data.updatedAt
  };
}

export function getMedia(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseMedia };
    return requestPublisher(f, 'media/', opts);
  };
}

export function getMediaProfileType(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseProfileType };
    return requestPublisher(f, `media/profile-types/${id}`, opts);
  };
}

export function listMediaProfileTypes(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseProfileTypeSummary), queryParams: params };
    return requestPublisher(f, `media/profile-types`, opts);
  };
}

export function getMediaSection(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseSection };
    return request(f, `media/sections/${id}`, opts);
  };
}
