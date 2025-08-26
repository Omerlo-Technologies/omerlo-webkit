import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import { parseVisual, type Visual } from './visuals';
import { parseMany, type ApiAssocs, type ApiData } from '$reader/utils/api';
import { getAssoc } from '$reader/utils/assocs';
import { request } from '$reader/utils/request';
import { parseContentSummary, type ContentSummary } from './contents';

export const magazineFetchers = (f: typeof fetch) => {
  return {
    getIssue: issueFetcher(f),
    getBlocks: issueBlocksFetcher(f),
    searchContents: contentsSearch(f),
    getSectionContents: sectionContentsFetcher(f)
  };
};

export function issueFetcher(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseIssue };
    return request(f, `/issues/${id}`, opts);
  };
}

export function issueBlocksFetcher(f: typeof fetch) {
  return async (sectionId: string) => {
    const opts = { parser: parseMany(parseIssueBlock) };
    return request(f, `/issues/sections/${sectionId}/blocks`, opts);
  };
}

export function contentsSearch(f: typeof fetch) {
  return async (issueId: string, q: string) => {
    const opts = { parser: parseMany(parseIssueSectionContent), queryParams: { q } };
    return request(f, `/issues/${issueId}/contents/search`, opts);
  };
}

export function sectionContentsFetcher(f: typeof fetch) {
  return async (sectionId: string) => {
    const opts = { parser: parseMany(parseContentSummary) };
    return request(f, `/issues/sections/${sectionId}/contents`, opts);
  };
}

/******************************************************************************
 * Parsers
 ******************************************************************************/

export function parseIssueSummary(data: ApiData, assocs: ApiAssocs): IssueSummary {
  return {
    id: data.id,
    issueType: getAssoc<IssueType>(assocs, 'issue_types', data.issue_type_id),
    kind: data.kind,
    name: data.name,
    color: data.color,
    pdfUrl: data.pdf_url,
    visual: parseVisual(data.visual, assocs),
    metadata: data.metadata,
    meta: {
      locales: parseLocalesMetadata(data.meta)
    },
    metadata: data.metadata,
    updatedAt: new Date(data.updated_at)
  };
}

export function parseIssue(data: ApiData, assocs: ApiAssocs): Issue {
  return {
    ...parseIssueSummary(data, assocs),
    advertisingKey: data.advertising_key,
    descriptionText: data.description_text,
    descriptionHtml: data.description_html,
    sections: data.sections.map((section: ApiData) => parseIssueSectionSummary(section, assocs))
  };
}

export function parseIssueSectionSummary(data: ApiData, assocs: ApiAssocs): IssueSectionSummary {
  return {
    id: data.id,
    name: data.name,
    advertisingKey: data.advertising_key,
    color: data.color,
    visual: parseVisual(data.visual, assocs),
    meta: {
      locales: parseLocalesMetadata(data.meta)
    },
    updatedAt: new Date(data.updated_at)
  };
}

export function parseIssueSection(data: ApiData, assocs: ApiAssocs): IssueSection {
  return {
    ...parseIssueSectionSummary(data, assocs),
    description: data.description
  };
}

export function parseIssueBlock(data: ApiData, assocs: ApiAssocs): IssueBlock {
  return {
    id: data.id,
    configuration: getAssoc<IssueBlockConfiguration>(
      assocs,
      'issue_block_configurations',
      data.configuration_id
    ),
    textColor: data.text_color,
    backgroundColor: data.background_color,
    backgroundSvg: data.background_svg,
    name: data.name,
    description: data.description,
    visual: parseVisual(data.visual, assocs),
    slots: data.slots.map((slot: ApiData) => parseIssueBlockSlot(slot, assocs)),
    meta: {
      locales: parseLocalesMetadata(data.meta)
    },
    updatedAt: new Date(data.updated_at)
  };
}

export function parseIssueBlockSlot(data: ApiData, assocs: ApiAssocs): IssueBlockSlot {
  return {
    id: data.id,
    content: getAssoc(assocs, 'contents', data.content_id)
  };
}

export function parseIssueSectionContent(data: ApiData, assocs: ApiAssocs): SectionContent {
  return {
    ...parseContentSummary(data, assocs),
    section: getAssoc<IssueSectionSummary>(assocs, 'issue_sections', data.section_id)
  };
}

export function parseIssueType(data: ApiData, _assocs: ApiAssocs): IssueType {
  return {
    id: data.id,
    key: data.key,
    name: data.name,
    svgIcon: data.svg_icon,
    meta: {
      locales: parseLocalesMetadata(data.meta)
    },
    updatedAt: new Date(data.updated_at)
  };
}

export function parseIssueBlockConfiguration(data: ApiData): IssueBlockConfiguration {
  return {
    id: data.id,
    key: data.key,
    minContents: data.min_contents,
    maxContents: data.max_contents,
    updatedAt: new Date(data.updated_at)
  };
}

/******************************************************************************
 * Interfaces
 ******************************************************************************/

export interface IssueSummary {
  id: string;
  issueType: IssueType;
  kind: 'pdf' | 'regular';
  name: string;
  color: string | null;
  pdfUrl: string | null;
  visual: Visual | null;
  metadata: { [key: string]: string };
  meta: {
    locales: LocalesMetadata;
  };
  metadata: { [key: string]: string };
  updatedAt: Date;
}

export interface Issue extends IssueSummary {
  advertisingKey: string | null;
  descriptionHtml: string | null;
  descriptionText: string | null;
  sections: IssueSectionSummary[];
}

export interface IssueType {
  id: string;
  key: string;
  name: string;
  svgIcon: string | null;
  meta: {
    locales: LocalesMetadata;
  };
  updatedAt: Date;
}

export interface IssueSectionSummary {
  id: string;
  name: string | null;
  advertisingKey: string | null;
  color: string | null;
  visual: Visual | null;
  meta: {
    locales: LocalesMetadata;
  };
  updatedAt: Date;
}

export interface IssueSection extends IssueSectionSummary {
  description: string | null;
}

export interface IssueBlock {
  id: string;
  configuration: IssueBlockConfiguration;
  textColor: string | null;
  backgroundColor: string | null;
  backgroundSvg: string | null;
  name: string | null;
  description: string | null;
  visual: Visual | null;
  slots: IssueBlockSlot[];
  meta: {
    locales: LocalesMetadata;
  };
  updatedAt: Date;
}

export interface SectionContent extends ContentSummary {
  section: IssueSectionSummary;
}

export interface IssueBlockConfiguration {
  id: string;
  key: string;
  minContents: number;
  maxContents: number;
  updatedAt: Date;
}

export interface IssueBlockSlot {
  id: string;
  content: ContentSummary;
}
