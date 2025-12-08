import { parseMany, type ApiAssocs, type PagingParams } from '../utils/api';
import type { ApiData, ApiParams } from '../utils/api';
import { requestPublisher } from '../utils/request';
import { parseLocalesMetadata, type LocalesMetadata } from '../utils/response';
import { parseVisual, type Metadata, type Visual } from '../parsers/common-parser';
import { buildMeta } from '../utils/parseHelpers';
import { parseContentSummary, type ContentSummary } from './contents';
import { getAssocs } from '$reader/utils/assocs';
import { parseDistribution, parseRelease, type Distribution, type Release } from './distributions';

export const mediaFetchers = (f: typeof fetch) => {
  return {
    getMedia: getMedia(f),
    getMediaSection: getMediaSection(f),
    getMediaBlock: getMediaBlock(f),
    listMediaSectionContents: listMediaSectionContents(f)
  };
};

export function getMedia(f: typeof fetch) {
  return async (params?: Partial<ApiParams>) => {
    const opts = { parser: parseMedia, queryParams: params };
    // NOTE the `/` is REALLY important
    return requestPublisher(f, 'media/', opts);
  };
}

export function getMediaSection(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseSection, queryParams: params };
    return requestPublisher(f, `/sections/${id}`, opts);
  };
}

export function listMediaSectionContents(f: typeof fetch) {
  return async (sectionId: string, params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseContentSummary), queryParams: params };
    return requestPublisher(f, `/sections/${sectionId}/contents`, opts);
  };
}

export function getMediaBlock(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseBlock, queryParams: params };
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
  metadata: Metadata;
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

export interface MediaSectionSEO {
  title: string | null;
  description: string | null;
}

export interface MediaSectionSummary {
  id: string;
  name: string;
  slug: string;
  visual: Visual | null;
  metadata: Metadata;
  meta: { locales: LocalesMetadata };
  color: string;
  updatedAt: Date;
}

export interface MediaSectionHierarchy extends MediaSectionSummary {
  sections: MediaSectionHierarchy[];
}

export interface MediaSection extends MediaSectionSummary {
  description: string | null;
  advertisingKey: string | null;
  sections: MediaSectionSummary[];
  blocks: MediaBlockSummary[];
  seo: MediaSectionSEO;
}

export interface MediaBlockConfigurationSummary {
  type: 'content' | 'distribution' | 'html' | 'media' | 'most_popular' | 'section';
  key: string;
}

export interface MediaBlockSummary {
  id: string;
}

export interface MediaBlock extends MediaBlockSummary {
  name: string | null;
  description: string | null;
  visual: Visual | null;
  html: string | null;
  metadata: Metadata;
  meta: { locales: LocalesMetadata };
  textColor: string | null;
  backgroundColor: string | null;
  backgroundSvg: string | null;
  configuration: MediaBlockConfigurationSummary;
  entries: MediaBlockEntry[];
  updatedAt: Date;
}

export interface MediaBlockEntry {
  contents: ContentSummary[];
  section: MediaSectionSummary | null;
  // media: ...
  distribution: Distribution | null;
  releases: Release[] | null;
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
  const seo: MediaSectionSEO = {
    title: data.localized.seo.title ?? null,
    description: data.localized.seo.description ?? null
  };
  return {
    id: data.id,
    name: data.localized.name,
    description: data.localized.description,
    seo,
    slug: data.localized.slug,
    visual: parseVisual(data.visual, assocs),
    meta: buildMeta(data.localized.locale),
    color: data.color,
    advertisingKey: data.advertising_key,
    metadata: data.metadata,
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
    metadata: data.metadata,
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
    type: data.block_type,
    key: data.key
  };
}

function parseBlockSummary(data: ApiData, _assocs: ApiAssocs): MediaBlockSummary {
  return {
    id: data.id
  };
}

function parseBlock(data: ApiData, assocs: ApiAssocs): MediaBlock {
  // NOTE: This is to support publisher public api v2
  if (data.localized !== undefined) {
    return {
      ...parseBlockSummary(data, assocs),
      name: data.localized?.name,
      description: data.localized?.description,
      visual: parseVisual(data.localized?.visual, assocs),
      html: data.localized?.html,
      metadata: data.metadata,
      meta: buildMeta(data.localized?.locale),
      textColor: data.text_color,
      backgroundColor: data.background_color,
      backgroundSvg: data.background_svg,
      configuration: {
        type: data.block_type,
        key: data.configuration_key
      },
      entries: data.entries.map((entry: ApiData) => parseBlockEntry(entry, assocs)),
      updatedAt: data.updatedAt
    };
  } else {
    return {
      ...parseBlockSummary(data, assocs),
      name: data.name,
      description: data.description,
      visual: parseVisual(data.visual, assocs),
      html: data.html,
      metadata: data.metadata,
      meta: { locales: parseLocalesMetadata(data.meta) },
      textColor: data.text_color,
      backgroundColor: data.background_color,
      backgroundSvg: data.background_svg,
      configuration: {
        type: data.block_type,
        key: data.configuration_key
      },
      entries: data.entries.map((entry: ApiData) => parseBlockEntry(entry, assocs)),
      updatedAt: data.updatedAt
    };
  }
}

function parseBlockEntry(data: ApiData, assocs: ApiAssocs): MediaBlockEntry {
  return {
    contents: getAssocs<ContentSummary>(assocs, 'contents', data.content_ids),
    section: data.section ? parseSectionSummary(data.section, assocs) : null,
    releases: data.releases
      ? data.releases.map((release: ApiData) => parseRelease(release, assocs))
      : [],
    distribution: data.distribution ? parseDistribution(data.distribution, assocs) : null
  };
}
