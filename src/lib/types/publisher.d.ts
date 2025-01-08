import type { ContentSummary, Seo } from "./composer";
import type { Visual } from "./core";

export interface AnnoucementSummary {
  id: string,
  locale: string,
  titleHtml: string,
  titleText: string,
  subtitleHtml: string,
  subtitleText: string,
  visual: Visual | null
}

export interface Annoucement extends AnnoucementSummary { }

export interface SectionSummary {
  id: section.id,
  locale: string,
  name: string,
  slug: string | null,
  visual: Visual | null,
  color: string | null,
}

export interface Section extends SectionSummary {
  description: string | null,
  seo: Seo,
  advertisingKey: section.advertisingKey,
  sections: SectionSummary[],
  blocks: BlockSummary[]
  insertedAt: Date,
  updatedAt: Date,
}

export interface BlockSummary {
  id: string,
}

interface BaseBlock {
  id: string,
  backgroundColor: string | null,
  textColor: string | null,
  locale: string,
  name: string | null,
  description: string | null,
  html: string | null,
  visual: Visual | null,
  backgroundSVG: string | null,
  configurationKey: string,
  type: 'content' | 'section' | 'distribution' | 'html' | 'media' | 'most_popular' | 'section_recursive',
}

export type Block = BlockContent | BlockSection | BlockDistribution | BlockHTML | BlockMedia

export interface BlockContent extends BaseBlock {
  entries: {
    contents: ContentSummary[],
  },
}

export interface BlockSection extends BaseBlock {
  entries: {
    contents: ContentSummary[],
    section: SectionSummary
  }[],
}

export interface BlockDistribution extends BaseBlock {
  entries: {
    // TODO
    // releases: ReleaseSummary
  }[]
}

export interface BlockHTML extends BaseBlock {}

export interface BlockMedia extends BaseBlock {
  entries: {
    // TODO
    // media: MediaSummary,
    contents: ContentSummary[]
  }[]
}
