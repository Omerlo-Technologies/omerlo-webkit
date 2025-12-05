import {
  parseMany,
  type ApiAssocs,
  type ApiData,
  type ApiParams,
  type PagingParams
} from '$reader/utils/api';
import { parseDate } from '$reader/utils/parseHelpers';
import { request } from '$reader/utils/request';
import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import { parseVisual, type Visual } from './visuals';

export const announcementsFetchers = (f: typeof fetch) => {
  return {
    listAnnouncements: listAnnouncements(f),
    getAnnouncement: getAnnouncement(f)
  };
};

//
// List announcemnets
//
export function listAnnouncements(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseAnnouncement), queryParams: params };
    return request(f, '/announcements', opts);
  };
}

export interface Announcement {
  id: string;
  titleHtml: string;
  titleText: string;
  subtitleHtml: string | null;
  subtitleText: string | null;
  visual: Visual | null;
  startsAt: Date;
  endsAt: Date | null;
  meta: {
    locales: LocalesMetadata;
  };
  updatedAt: Date;
}

function parseAnnouncement(data: ApiData, assocs: ApiAssocs): Announcement {
  return {
    id: data.id,
    titleHtml: data.title_html,
    titleText: data.title_text,
    subtitleHtml: data.subtitle_html,
    subtitleText: data.subtitle_text,
    visual: parseVisual(data.visual, assocs),
    startsAt: parseDate(data.starts_at),
    endsAt: parseDate(data.ends_at),
    meta: { locales: parseLocalesMetadata(data.meta) },
    updatedAt: new Date(data.updated_at)
  };
}

//
// Get announcement
//
export function getAnnouncement(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseAnnouncement, queryParams: params };
    return request(f, `/announcements/${id}`, opts);
  };
}
