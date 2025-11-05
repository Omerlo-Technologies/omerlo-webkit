import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import {
  parseMany,
  type ApiAssocs,
  type ApiData,
  type ApiParams,
  type PagingParams
} from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import { buildMeta } from '$reader/utils/parseHelpers';

export const categoriesFetchers = (f: typeof fetch) => {
  return {
    listCategories: listCategories(f),
    getCategory: getCategory(f)
  };
};

export interface Category {
  id: string;
  svg: string;
  name: string;
  meta: {
    locales: LocalesMetadata;
  };
  updatedAt: Date;
}

export function getCategory(f: typeof fetch) {
  return async (id: string, params?: Partial<ApiParams>) => {
    const opts = { parser: parseCategory, queryParams: params };
    return requestPublisher(f, `media/categories/${id}`, opts);
  };
}

export function listCategories(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseCategory), queryParams: params };
    return requestPublisher(f, `media/categories`, opts);
  };
}

export function parseCategory(data: ApiData, _assoc: ApiAssocs): Category {
  // NOTE: this is to support publisher public api v2 but also reader api v1
  if (data.localized) {
    return {
      id: data.id,
      name: data.localized.name,
      svg: data.svg_icon,
      meta: buildMeta(data.localized.locale),
      updatedAt: data.updated_at
    };
  } else {
    return {
      id: data.id,
      name: data.name,
      svg: data.svg_icon,
      meta: { locales: parseLocalesMetadata(data.meta) },
      updatedAt: data.updated_at
    };
  }
}
