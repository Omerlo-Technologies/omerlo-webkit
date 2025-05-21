import type { LocalesMetadata } from '$reader/utils/response';
import type { Category } from './categories';
import type { ContentBlockTemplate, ContentTemplate } from './content-templates';
import type { Visual } from './visuals';

export interface ContentSummary {
  id: string;
  template: ContentTemplate;
  metadata: Record<string, string>;
  canonicalDomain: string;
  canonicalUrl: string;
  isArchived: boolean;
  publishedAt?: Date;
  visibility?: string;
  categories: Category[];
  show_published_at: boolean;
  updatedAt: Date;
  meta: {
    locales: LocalesMetadata;
  };
  titleHtml: string;
  titleText: string;
  leadHtml: string;
  leadText: string;
  subtitleHtml: string;
  subtitleText: string;
  visual: Visual;
  seo: ContentSeo;
  // TODO authors
}

export interface ContentSeo {
  title: string;
  description: string;
}

export interface Content extends ContentSummary {
  blocks: ContentBlock[];
}

export type ContentBlock = ContentBlockRichtext | ContentBlockData;

export type ContentBlockRichtext = {
  id: string;
  template: ContentBlockTemplate;
  visual?: Visual;
  kind: 'richtext';
  contentHtml: string;
};

export type ContentBlockData = {
  id: string;
  template: ContentBlockTemplate;
  visual?: Visual;
  kind: 'data';
  contentType: string;
  data: unknown;
};

// TODO others content's blocks
