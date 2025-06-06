import { buildMeta, parseDate } from '$reader/utils/parseHelpers';
import type { LocalesMetadata } from '$reader/utils/response';
import { parseVisual, type Visual } from './visuals';
import { parseMany, type ApiAssocs, type ApiData } from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import { type PagingParams } from '$reader/utils/api';

export const announcementsFetchers = (f: typeof fetch) => {
  return {
    listAnnouncements: listAnnouncements(f),
    getAnnouncement: getAnnouncement(f)
  };
};

export interface Announcement {
  id: string;
  meta: {
    locales: LocalesMetadata;
  };
  titleHtml: string;
  titleText: string;
  subtitleHtml: string | null;
  subtitleText: string | null;
  link: string | null;
  visual: Visual | null;
  startsAt: Date;
  endsAt: Date | null;
  updatedAt: Date;
}

export function getAnnouncement(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseAnnouncement };
    return requestPublisher(f, `announcements/${id}`, opts);
  };
}

export function listAnnouncements(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseAnnouncement), queryParams: params };
    return requestPublisher(f, `announcements`, opts);
  };
}

export function parseAnnouncement(data: ApiData, assoc: ApiAssocs): Announcement {
  return {
    id: data.id,
    meta: buildMeta(data.localized.locale),
    titleHtml: data.localized.title_html,
    titleText: data.localized.title_text,
    subtitleHtml: data.localized.subtitle_html,
    subtitleText: data.localized.subtitle_text,
    link: data.localized.link,
    visual: parseVisual(data.localized.visual, assoc),
    startsAt: new Date(data.starts_at),
    endsAt: parseDate(data.ends_at),
    updatedAt: new Date(data.updated_at)
  };
}
