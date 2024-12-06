import { MEDIA_URL } from "../publisher";
import type { ApiData, Category } from "$types/core";
import { omerloFetch, parseMany } from '../';

export function categoryFetcher(f: typeof fetch) {
  return (id: string) => {
    const opts = { parser: categoryParser }
    return omerloFetch(f, `${MEDIA_URL}/categories/${id}`, opts);
  }
}

type CategoriesParams = {
  limit: number,
}

export function categoriesFetcher(f: typeof fetch) {
  return (params?: CategoriesParams) => {
    const opts = {params: params, parser: parseMany(categoryParser)};
    return omerloFetch(f, `${MEDIA_URL}/categories`, opts );
  }
}

export function categoryParser(data: ApiData, _assocs: ApiData = {}): Category {
  return {
    id: data.id,
    name: data.localized.name,
    locale: data.localized.locale,
    svg_icon: data.svg_icon
  }
}
