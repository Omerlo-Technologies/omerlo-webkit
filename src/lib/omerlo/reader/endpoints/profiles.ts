import { parsePersonSummary, type Person, type PersonSummary } from './person';
import { parseProjectSummary, type Project, type ProjectSummary } from './projects';
import { parseEventSummary, type EventSummary } from './events';
import {
  parseOrganizationSummary,
  type Organization,
  type OrganizationSummary
} from './organizations';
import type { ApiAssocs, ApiData } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import { getAssocs } from '$reader/utils/assocs';
import type { ContentSummary } from './contents';
import {
  type Image,
  type Slideshow,
  type Video,
  parseImage,
  parseSlideshow,
  parseVideo
} from './visuals';
import { buildMeta } from '$reader/utils/parseHelpers';

export type Profile = Person | Project | Event | Organization;
export type ProfileSummary = PersonSummary | ProjectSummary | EventSummary | OrganizationSummary;
export type ProfileBlockKind = ProfileBlockContents | ProfileBlockRelations;

type ProfileKind = 'person' | 'project' | 'event' | 'organization';

function getProfileParser(): Record<
  ProfileKind,
  (data: ApiData, _assocs: ApiAssocs) => ProfileSummary
> {
  return {
    person: parsePersonSummary,
    project: parseProjectSummary,
    event: parseEventSummary,
    organization: parseOrganizationSummary
  };
}

export function parseProfileSummary(data: ApiData, assocs: ApiAssocs): ProfileSummary {
  const profileParser = getProfileParser();
  const parser = profileParser[data.kind as ProfileKind];

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

export interface ProfileContact {
  phone: string | null;
  email: string | null;
  linkedin: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  meta: {
    locales: LocalesMetadata;
  };
}

export interface ProfileDescription {
  meta: {
    locales: LocalesMetadata;
  };
  blocks: ProfileDescriptionBlock[];
}

export type ProfileDescriptionBlock = {
  kind: string;
  contentHtml: string;
  contentText: string;
  image: Image | null;
  slideshow: Slideshow | null;
  video: Video | null;
};

export type ProfileBlock = {
  id: string;
  profileType: string;
  profileBlockType: string;
  kind: string;
  layout: string;
  meta: {
    locales: LocalesMetadata | null;
  };
  name: string | null;
  updatedAt: Date;
};

export interface ProfileBlockContents extends ProfileBlock {
  contents: ContentSummary[];
}

export interface ProfileBlockRelations extends ProfileBlock {
  profiles: ProfileSummary[];
}

export function parseProfileBlock(data: ApiData, assocs: ApiAssocs): ProfileBlockKind {
  if (data.kind === 'selected_content') {
    const contents = data.content_ids
      ? getAssocs<ContentSummary>(assocs, 'contents', data.content_ids)
      : [];
    return {
      ...profileBlockParser(data, assocs),
      contents
    };
  } else {
    const profiles = data.profile_ids
      ? getAssocs<ProfileSummary>(assocs, 'profiles', data.profile_ids)
      : [];
    return {
      ...profileBlockParser(data, assocs),
      profiles
    };
  }
}

function profileBlockParser(data: ApiData, _assocs: ApiAssocs): ProfileBlock {
  const name = data.localized ? data.localized.name : null;
  const meta = data.localized ? buildMeta(data.localized.locale) : { locales: null };
  return {
    id: data.id,
    profileType: data.profile_type_id,
    layout: data.layout,
    kind: data.kind,
    profileBlockType: data.block_type_id,
    meta,
    name,
    updatedAt: new Date(data.updated_at)
  };
}

export function parseProfileAddress(data: ApiData, _assocs: ApiAssocs): ProfileAddress {
  return {
    state: data.state,
    location: data.location,
    city: data.city,
    street: data.street,
    country: data.country,
    meta: buildMeta(data.locale)
  };
}

export function parseProfileContact(data: ApiData, _assocs: ApiAssocs): ProfileContact {
  return {
    phone: data.phone,
    email: data.email,
    linkedin: data.linkedin,
    website: data.website,
    facebook: data.facebook,
    twitter: data.twitter,
    meta: buildMeta(data.locale)
  };
}

export function parseProfileDescriptionBlock(
  data: ApiData,
  assocs: ApiAssocs
): ProfileDescriptionBlock {
  const image = data.image ? parseImage(data.image, assocs) : null;
  const slideshow = data.slideshow ? parseSlideshow(data.slideshow, assocs) : null;
  const video = data.video ? parseVideo(data.video, assocs) : null;

  return {
    kind: data.kind,
    contentHtml: data.content_html,
    contentText: data.content_text,
    image,
    slideshow,
    video
  };
}

export function parseProfileDescription(data: ApiData, assocs: ApiAssocs): ProfileDescription {
  const blocks = data.blocks
    ? data.blocks.map((block: ApiData) => parseProfileDescriptionBlock(block, assocs))
    : [];

  return {
    meta: buildMeta(data.locale),
    blocks
  };
}

export function isEvent(profile: ProfileSummary): profile is PersonSummary {
  return profile.kind === 'event';
}

export function isOrganization(profile: ProfileSummary): profile is OrganizationSummary {
  return profile.kind === 'organization';
}

export function isPerson(profile: ProfileSummary): profile is PersonSummary {
  return profile.kind === 'person';
}

export function isProject(profile: ProfileSummary): profile is ProjectSummary {
  return profile.kind === 'project';
}
