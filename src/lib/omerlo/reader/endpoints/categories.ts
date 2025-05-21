import { type LocalesMetadata } from "$reader/utils/response";
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from "$reader/utils/api";
import { requestPublisher } from "../utils/request";

export const categoriesFetchers = (f: typeof fetch) => {
  return {
    listCategories: listCategories(f),
    getCategory: getCategory(f)
  }
}

export interface Category{
  id: string;
  svg: string;
  name: string;
  meta: {
    locale: LocalesMetadata;
  },
  updatedAt: Date;
}

export function getCategory(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseCategory };
    return requestPublisher(f, `/categories/${id}`, opts);
  }
}

export function listCategories(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const  queryParams = params
    const opts = { parser: parseMany(parseCategory), queryParams };
    return requestPublisher(f, `/categories`, opts);
  }
}

export function parseCategory(data: ApiData, _assoc: ApiAssocs): Category {
  return {
    id: data.id,
    svg: data.svg_icon,
    name: data.localized.name,
    updatedAt: data.updated_at,
    meta: {
      locale: {
        available: [data.localized.locale],
        current: data.localized.locale
      }
    }
  }
}
