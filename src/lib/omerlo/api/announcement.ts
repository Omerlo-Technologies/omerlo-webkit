import { OMERLO_PATH } from './index';
import { omerloFetch, parseMany } from '..';
import type { ApiParams, ListParams } from '../fetcher-params';
import type { ApiData } from '$types/core';
import type { ApiAssocs } from '../assocs';
import type { Annoucement, AnnoucementSummary } from '$types/publisher';
import { parseVisual } from './visual';

export interface AnnouncementsParams extends ListParams { }

export function announcementsFetcher(f: typeof fetch) {
  return (params?: Partial<AnnouncementsParams>) => {
    const opts = { parser: parseMany(announcementSummaryParser), params };
    return omerloFetch(f, `/${OMERLO_PATH}/announcements`, opts);
  }
}

export interface AnnouncementParams extends ApiParams {}

export function announcementFetcher(f: typeof fetch) {
  return (id: string, params?: Partial<AnnouncementParams>) => {
    const opts = { parser: parseMany(announcementSummaryParser), params };
    return omerloFetch(f, `${OMERLO_PATH}/announcements/${id}`, opts);
  }
}

export function announcementSummaryParser(data: ApiData, _assocs: ApiAssocs): AnnoucementSummary {
  return {
    id: data.id,
    locale: data.locale,
    titleHtml: data.title_html,
    titleText: data.title_text,
    subtitleHtml: data.subtitle_html,
    subtitleText: data.subtitle_text,
		visual: parseVisual(data.localized.visual),
  };
}

export function announcementParser(data: ApiData, assocs: ApiAssocs): Annoucement {
  return {...announcementSummaryParser(data, assocs)};
}
