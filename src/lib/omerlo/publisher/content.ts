import { MEDIA_URL } from "../publisher";
import type { Content, ContentSummary, ContentTemplate } from '$types/composer';
import type { ApiData, Category } from '$types/core';
import { parseVisual } from '../core/visual';
import { seoParser } from './seo';
import { getAssocs } from "../assocs";
import { omerloFetch } from "..";

export function contentFetcher(f: typeof fetch) {
  return (id: string) => {
    const opts = { parser: contentParser }
    return omerloFetch(f, `${MEDIA_URL}/contents/${id}`, opts);
  }
}

export function contentSummaryParser(data: ApiData, assocs: ApiData = {}): ContentSummary {
  return {
    id: data.id,
    // authors: getAssocs(assocs, 'profiles', data.author_ids),
    authors: [],
    templateId: data.template_id,
    locale: data.localized.locale,
    visibility: data.visibility,
    canonicalDomain: data.canonical_domain,
    canonicalUrl: data.canonical_url,
    categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
    publishedAt: data.published_at,
    showPublishedAt: data.show_published_at,
    updatedAt: data.updated_at,
    titleHtml: data.localized.title_html,
    titleText: data.localized.title_text,
    subtitleHtml: data.localized.subtitle_html,
    subtitleText: data.localized.subtitle_text,
    leadHtml: data.localized.lead_html,
    leadText: data.localized.lead_text,
    seo: seoParser(data.localized.seo),
    visual: parseVisual(data.localized.visual),
  };
}

export function contentParser(data: ApiData, assocs: ApiData = {}): Content {
  return {
    ...contentSummaryParser(data, assocs),
    // TODO
    blocks: []
  };
}

export function parseTemplate(data: ApiData, _assocs: ApiData = {}): ContentTemplate {
  return {
    id: data.id,
    key: data.key,
    name: data.localized.name,
    locale: data.localized.locale,
    updatedAt: data.updated_at,
  };
}
