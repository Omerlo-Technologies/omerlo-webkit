import type { ApiData, Category, Image, Video, Visual } from "./core"

/**
* Docs
**/

export interface ContentSummary {
  id: string,
  authors: (Person | Organization)[],
  template: ContentTemplate,
  locale: string,
  visibility: 'free' | 'metered' | 'restricted' | 'authenticated',
  canonicalDomain: string,
  canonicalUrl: string,
  categories: Category[],
  publishedAt: Date,
  showPublishedAt: boolean,
  updatedAt: Date
  titleHtml: string,
  titleText: string,
  subtitleHtml: string | null,
  subtitleText: string | null,
  leadHtml: string | null,
  leadText: string | null,
  seo: Seo,
  visual: Visual
}

export interface Content extends ContentSummary {
  blocks: ContentBlock[],
}

/**
* Contents Block
**/

export type ContentBlock =
  ContentBlockQuestion
  | ContentBlockRichtext
  | ContentBlockData
  | ContentBlockHtml
  | ContentBlockQuote
  | ContentBlockRelatedContent
  | ContentBlockImage
  | ContentBlockSlideshow
  | ContentBlockVideo

export interface ContentBlockRichtext { id: string, contentHtml: string | null, }

export interface ContentBlockHtml { id: string, contentHtml: string | null, }
export interface ContentBlockRelatedContent { id: string, contents: ContentSummary[], }
export interface ContentBlockImage { id: string, image: Image, }
export interface ContentBlockSlideshow { id: string, images: Image[], }
export interface ContentBlockVideo { id: string, video: Video, }

export interface ContentBlockQuote {
  id: string,
  quoteHtml: string,
  quoteText: string,
  author: string | null,
}

export interface ContentBlockData {
  id: string,
  contentType: 'json' | 'csv',
  template: string,
  data: unknown,
}

export interface ContentTemplate {
  id: string,
  key: string,
  locale: string,
  name: string,
  updatedAt: Date,
}

export interface ContentBlockQuestion {
  id: string,
  questionHtml: string,
  questionText: string,
  acceptVotesUntil: Date,
  // TODO
  // answers: [],
}

/**
* Communities
**/

export interface ProfileSummary {
  id: string,
  profileType: ProfileTypeSummary,
  updatedAt: Date,
}

export interface Profile extends ProfileSummary {
  categories: Category[],
}

export interface ProfileAddress {
  locale: string,
  country: string | null,
  state: string | null,
  city: string | null,
  street: string | null,
  location: string | null,
}

export interface ProfileContact {
  locale: string,
  phone: string | null,
  email: string | null,
  linkedin: string | null,
  website: string | null,
  twitter: string | null,
  facebook: string | null,
}

export interface EventSummary extends ProfileSummary {
  subscriptionUrl: string,
  logoImageUrl: string | null,
  coverImageUrl: string | null,
  isAllDay: boolean,
  startsAt: Date,
  endsAt: Date,
  locale: string | null,
  name: string,
  descriptionHtml: string | null,
  descriptionText: string | null,
  summaryHtml: string | null,
  summaryText: string | null,
}

export interface Event extends EventSummary {
  address: ProfileAddress | null,
  content: ProfileContact | null,
}

export interface PersonSummary extends ProfileSummary & {
  firstName: string,
  lastName: string,
  otherName: string | null,
  pronoun: string | null,
  logoImageUrl: string | null,
  coverImageUrl: string | null,
  locale: string | null,
  descriptionHtml: string | null,
  descriptionText: string | null,
  summaryHtml: string | null,
  summaryText: string | null,
}

export interface Person extends ProfileSummary, PersonSummary {
  address: ProfileAddress | null,
  content: ProfileContact | null,
}

export interface ProjectSummary extends ProfileSummary {
  logoImageUrl: string | null,
  coverImageUrl: string | null,
  locale: string | null,
  name: string,
  descriptionHtml: string | null,
  descriptionText: string | null,
  summaryHtml: string | null,
  summaryText: string | null,
}

export interface Project extends ProfileSummary, ProjectSummary {
  address: ProfileAddress | null,
  content: ProfileContact | null,
}

export interface OrganizationSummary extends ProfileSummary {
  name: string,
  logoImageUrl: string | null,
  coverImageUrl: string | null,
  locale: string | null,
  descriptionHtml: string | null,
  descriptionText: string | null,
  summaryHtml: string | null,
  summaryText: string | null,
}

export interface Organization extends ProfileSummary, OrganizationSummary {
  address: ProfileAddress | null,
  content: ProfileContact | null,
}


/**
* Configs
**/

export interface ProfileType extends ProfileTypeSummary {
  hasPhone: boolean,
  hasEmail: boolean,
  hasLinkedin: boolean,
  hasWebsite: boolean,
  hasFacebook: boolean,
  hasTwitter: boolean,
  hasCountry: boolean,
  hasState: boolean,
  hasCity: boolean,
  hasStreet: boolean,
}

export interface ProfileTypeSummary {
  id: string,
  kind: 'person' | 'organization' | 'event' | 'project',
  name: string,
  locale: string,
  updatedAt: string,
}

/**
* Common
**/

export interface Seo {
  title?: string,
  description?: string,
}

