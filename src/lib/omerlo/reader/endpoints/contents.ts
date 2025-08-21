import type { Category } from './categories';
import type { ContentBlockTemplate, ContentTemplate } from './content-templates';
import {
  type Visual,
  type Slideshow,
  type Image,
  type Video,
  parseVideo,
  parseImage,
  parseSlideshow,
  parseVisual
} from './visuals';
import { requestPublisher } from '$reader/utils/request';
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';
import { getAssoc, getAssocs } from '$reader/utils/assocs';
import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import { buildMeta, parseDate } from '$reader/utils/parseHelpers';

import type { PersonSummary } from './person';
import type { OrganizationSummary } from './organizations';

export type AuthorSummary = PersonSummary | OrganizationSummary;

export const contentsFetchers = (f: typeof fetch) => {
  return {
    getContent: getContent(f),
    listContents: listContents(f)
  };
};

export interface ContentSeo {
  title: string | null;
  description: string | null;
}

export interface ContentSummary {
  id: string;
  metadata: Record<string, string>;
  template: ContentTemplate;
  canonicalDomain: string | null;
  canonicalUrl: string | null;
  publishedAt: Date | null;
  visibility: string | null;
  categories: Category[];
  showPublishedAt: boolean;
  updatedAt: Date;
  titleHtml: string;
  titleText: string;
  leadHtml: string | null;
  leadText: string | null;
  subtitleHtml: string | null;
  subtitleText: string | null;
  visual: Visual | null;
  meta: {
    locales: LocalesMetadata;
  };
  authors: AuthorSummary[];
}

export interface Content extends ContentSummary {
  seo: ContentSeo;
  blocks: ContentBlock[];
}

export type ContentBlockRichtext = {
  id: string;
  kind: 'richtext';
  contentHtml: string;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockData = {
  id: string;
  kind: 'data';
  contentType: string;
  data: string;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockHTML = {
  id: string;
  kind: 'html';
  contentHtml: string;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockQuote = {
  id: string;
  kind: 'quote';
  quoteHtml: string;
  quoteText: string;
  author: string;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockRelatedContents = {
  id: string;
  kind: 'related_contents';
  contents: ContentSummary[];
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type Answer = {
  id: string;
  contentHtml: string;
  contentText: string;
};

export type ContentBlockQuestion = {
  id: string;
  kind: 'question';
  questionHtml: string;
  questionText: string;
  acceptVoteUntil: Date;
  answers: Answer[];
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockImage = {
  id: string;
  kind: 'image';
  image: Image;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockSlideshow = {
  id: string;
  kind: 'slideshow';
  slideshow: Slideshow;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlockVideo = {
  id: string;
  kind: 'video';
  video: Video;
  visual: Visual | null;
  template: ContentBlockTemplate | null;
};

export type ContentBlock =
  | ContentBlockRichtext
  | ContentBlockData
  | ContentBlockHTML
  | ContentBlockQuote
  | ContentBlockRelatedContents
  | ContentBlockQuestion
  | ContentBlockImage
  | ContentBlockSlideshow
  | ContentBlockVideo;

export type ContentBlockType =
  | 'richtext'
  | 'data'
  | 'html'
  | 'quote'
  | 'related_contents'
  | 'question'
  | 'image'
  | 'slideshow'
  | 'video';

function baseBlock(data: ApiData, assocs: ApiAssocs) {
  return {
    id: data.id,
    kind: data.kind,
    template: getBlockTemplate(data, assocs),
    visual: parseVisual(data.visual, assocs)
  };
}

export function getContent(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseContent };
    return requestPublisher(f, `media/contents/${id}`, opts);
    // TODO: switch to Reader API (this API is already completed and documented)
    // return request(f, `/contents/${id}`, opts)
  };
}

export function listContents(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseContentSummary), queryParams: params };
    return requestPublisher(f, `media/contents`, opts);
  };
}

export function parseContentSummary(data: ApiData, assocs: ApiAssocs): ContentSummary {
  const metadata = (data.metadata ?? []).reduce(
    (acc: Record<string, string>, { key, value }: { key: string; value: string }) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  if (data.localized) {
    // NOTE: This is to support publisher public api v2

    return {
      id: data.id,
      template: getAssoc<ContentTemplate>(assocs, 'templates', data.template_id),
      canonicalDomain: data.canonical_domain,
      canonicalUrl: data.canonical_url,
      publishedAt: parseDate(data.published_at),
      visibility: data.visibility,
      categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
      showPublishedAt: data.show_published_at,
      updatedAt: new Date(data.updated_at),
      titleHtml: data.localized.title_html,
      titleText: data.localized.title_text,
      leadHtml: data.localized.lead_html,
      leadText: data.localized.lead_text,
      subtitleHtml: data.localized.subtitle_html,
      subtitleText: data.localized.subtitle_text,
      visual: parseVisual(data.localized.visual, assocs),
      meta: buildMeta(data.localized.locale),
      metadata: metadata,
      authors: getAssocs<AuthorSummary>(assocs, 'profiles', data.localized.author_ids)
    };
  } else {
    return {
      id: data.id,
      template: getAssoc<ContentTemplate>(assocs, 'content_templates', data.template_id),
      canonicalDomain: data.canonical_domain,
      canonicalUrl: data.canonical_url,
      publishedAt: parseDate(data.published_at),
      visibility: data.visibility,
      categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
      showPublishedAt: data.show_published_at,
      updatedAt: new Date(data.updated_at),
      titleHtml: data.title_html,
      titleText: data.title_text,
      leadHtml: data.lead_html,
      leadText: data.lead_text,
      subtitleHtml: data.subtitle_html,
      subtitleText: data.subtitle_text,
      visual: parseVisual(data.visual, assocs),
      meta: { locales: parseLocalesMetadata(data.meta) },
      metadata: metadata,
      authors: getAssocs<AuthorSummary>(assocs, 'profiles', data.author_ids)
    };
  }
}

export function parseContent(data: ApiData, assocs: ApiAssocs): Content {
  let seo: ContentSeo;

  if (data.localized) {
    seo = { title: data.localized.seo.title, description: data.localized.seo.description };
  } else {
    seo = { title: data.seo.title, description: data.seo.description };
  }

  return {
    ...parseContentSummary(data, assocs),
    metadata: data.metadata,
    seo,
    blocks: data.localized.blocks
      .map((block: ApiData) => parseContentBlock(block, assocs))
      .filter(Boolean) as ContentBlock[]
  };
}

const ContentBlockParser: Record<
  ContentBlockType,
  (block: ApiData, _assocs: ApiAssocs) => ContentBlock
> = {
  richtext: parseContentBlockRichtext,
  data: parseContentBlockData,
  html: parseContentBlockHTML,
  quote: parseContentBlockQuote,
  related_contents: parseContentBlockRelatedContents,
  question: parseContentBlockQuestion,
  image: parseContentBlockImage,
  slideshow: parseContentBlockSlideshow,
  video: parseContentBlockVideo
};

export function parseContentBlock(block: ApiData, assocs: ApiAssocs): ContentBlock | null {
  const parser = ContentBlockParser[block.kind as ContentBlockType];
  return parser ? parser(block, assocs) : null;
}

function getBlockTemplate(data: ApiData, assocs: ApiAssocs): ContentBlockTemplate | null {
  return data.template_id
    ? getAssoc<ContentBlockTemplate>(assocs, 'block_templates', data.template_id)
    : null;
}

function getBlockContents(data: ApiData, assocs: ApiAssocs): ContentSummary[] | [] {
  return data.content_ids ? getAssocs<ContentSummary>(assocs, 'contents', data.content_ids) : [];
}

function parseContentBlockRichtext(data: ApiData, assocs: ApiAssocs): ContentBlockRichtext {
  return {
    ...baseBlock(data, assocs),
    contentHtml: data.content_html
  };
}

function parseContentBlockData(data: ApiData, assocs: ApiAssocs): ContentBlockData {
  return {
    ...baseBlock(data, assocs),
    contentType: data.content_type,
    data: data.data
  };
}

function parseContentBlockHTML(data: ApiData, assocs: ApiAssocs): ContentBlockHTML {
  return {
    ...baseBlock(data, assocs),
    contentHtml: data.content_html
  };
}

function parseContentBlockQuote(data: ApiData, assocs: ApiAssocs): ContentBlockQuote {
  return {
    ...baseBlock(data, assocs),
    quoteHtml: data.quote_html,
    quoteText: data.quote_text,
    author: data.author
  };
}

function parseContentBlockRelatedContents(
  data: ApiData,
  assocs: ApiAssocs
): ContentBlockRelatedContents {
  const contents = getBlockContents(data, assocs);

  return {
    ...baseBlock(data, assocs),
    contents
  };
}

function parseContentBlockQuestion(data: ApiData, assocs: ApiAssocs): ContentBlockQuestion {
  return {
    ...baseBlock(data, assocs),
    questionHtml: data.question_html,
    questionText: data.question_text,
    acceptVoteUntil: new Date(data.accept_vote_until),
    answers: data.answers?.map((answer: ApiData) => parseAnswer(answer)) || []
  };
}

function parseAnswer(data: ApiData): Answer {
  return {
    id: data.id,
    contentHtml: data.content_html,
    contentText: data.content_text
  };
}

function parseContentBlockImage(data: ApiData, assocs: ApiAssocs): ContentBlockImage {
  return {
    ...baseBlock(data, assocs),
    image: parseImage(data.image, assocs)
  };
}

function parseContentBlockSlideshow(data: ApiData, assocs: ApiAssocs): ContentBlockSlideshow {
  return {
    ...baseBlock(data, assocs),
    slideshow: parseSlideshow(data.slideshow, assocs)
  };
}

function parseContentBlockVideo(data: ApiData, assocs: ApiAssocs): ContentBlockVideo {
  return {
    ...baseBlock(data, assocs),
    video: parseVideo(data.video, assocs)
  };
}
