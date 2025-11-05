import { type ApiAssocs, type ApiData, type ApiParams } from '$reader/utils/api';
import type { LocalesMetadata } from '$reader/utils/response';
import { buildMeta } from '$reader/utils/parseHelpers';
import { requestPublisher } from '../utils/request';

export interface MenuSummary {
  id: string;
  name: string;
  key: string;
  insertedAt: Date;
  updatedAt: Date;
}

export const menuFetchers = (f: typeof fetch) => {
  return {
    getMenu: getMenu(f)
  };
};

export function getMenu(f: typeof fetch) {
  return async (key: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseMenu, queryParams: params };
    return requestPublisher(f, `media/menus/${key}`, opts);
  };
}

export interface Menu extends MenuSummary {
  meta: {
    locales: LocalesMetadata;
  };
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  url: string;
  openNewTab: boolean;
  items: MenuItem[];
}

export function parseMenuSummary(data: ApiData, _assocs: ApiAssocs): MenuSummary {
  return {
    id: data.id,
    name: data.name,
    key: data.key,
    insertedAt: new Date(data.inserted_at),
    updatedAt: new Date(data.updated_at)
  };
}

export function parseMenu(data: ApiData, _assocs: ApiAssocs): Menu {
  return {
    ...parseMenuSummary(data, _assocs),
    items: getItems(data.localized, _assocs),
    meta: buildMeta(data.localized.locale)
  };
}

export function parseMenuItem(data: ApiData, _assocs: ApiAssocs): MenuItem {
  return {
    id: data.id,
    name: data.name,
    url: data.url,
    openNewTab: data.open_new_tab,
    items: getItems(data, _assocs)
  };
}

function getItems(data: ApiData, _assocs: ApiAssocs): MenuItem[] {
  return data.items.map((item: ApiData) => parseMenuItem(item, _assocs));
}
