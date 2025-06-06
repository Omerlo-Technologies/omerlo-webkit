import type { ApiAssocs, PagingParams } from '../utils/api';
import { parseMany, type ApiData } from '../utils/api';
import { requestPublisher } from '../utils/request';
import type { LocalesMetadata } from '../utils/response';
import { parseVisual, type Visual } from './visuals';
import { buildMeta } from '../utils/parseHelpers';
import { parseOrganization, parseOrganizationSummary } from './organizations';
import { parseEvent, parseEventSummary } from './events';
import { parseProfileBlock } from './profiles';
import { parsePerson, parsePersonSummary } from './person';
import { parseProject, parseProjectSummary } from './projects';
import { parseProfileType, parseProfileTypeSummary } from './profileType';
import { parseMenu, parseMenuSummary } from './menu';

export const mediaFetchers = (f: typeof fetch) => {
  return {
    getMedia: getMedia(f),
    getMediaOrganization: getMediaOrganization(f),
    listMediaOrganizations: listMediaOrganizations(f),
    getMediaEvent: getMediaEvent(f),
    listMediaEvents: listMediaEvents(f),
    listMediaEventBlocks: listMediaEventBlocks(f),
    getMediaPerson: getMediaPerson(f),
    listMediaPersons: listMediaPersons(f),
    getMediaProject: getMediaProject(f),
    listMediaProjects: listMediaProjects(f),
    getMediaProfileType: getMediaProfileType(f),
    listMediaProfileTypes: listMediaProfileTypes(f),
    getMediaMenu: getMediaMenu(f),
    listMediaMenus: listMediaMenus(f)
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
    return requestPublisher(f, 'media/', opts);
  };
}

export function getMediaOrganization(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseOrganization };
    return requestPublisher(f, `media/organizations/${id}`, opts);
  };
}

export function listMediaOrganizations(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseOrganizationSummary), queryParams: params };
    return requestPublisher(f, `media/organizations`, opts);
  };
}

export function getMediaEvent(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseEvent };
    return requestPublisher(f, `media/events/${id}`, opts);
  };
}

export function listMediaEvents(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseEventSummary), queryParams: params };
    return requestPublisher(f, `media/events`, opts);
  };
}

export function listMediaEventBlocks(f: typeof fetch) {
  return async (id: string, params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseProfileBlock), queryParams: params };
    return requestPublisher(f, `media/events/${id}/blocks`, opts);
  };
}

export function getMediaPerson(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parsePerson };
    return requestPublisher(f, `media/people/${id}`, opts);
  };
}

export function listMediaPersons(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parsePersonSummary), queryParams: params };
    return requestPublisher(f, `media/people`, opts);
  };
}

export function getMediaProject(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseProject };
    return requestPublisher(f, `media/projects/${id}`, opts);
  };
}

export function listMediaProjects(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseProjectSummary), queryParams: params };
    return requestPublisher(f, `media/projects`, opts);
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

export function listMediaMenus(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseMenuSummary), queryParams: params };
    return requestPublisher(f, `media/menus`, opts);
  };
}

export function getMediaMenu(f: typeof fetch) {
  return async (key: string) => {
    const opts = { parser: parseMenu };
    return requestPublisher(f, `media/menus/${key}`, opts);
  };
}
