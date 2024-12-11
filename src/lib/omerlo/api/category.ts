import { MEDIA_PATH } from "./index";
import type { ApiData, Category } from "$types/core";
import { omerloFetch, parseMany } from '../';
import type { ApiAssocs } from "../assocs";
import type { ListParams } from "../fetcher-params";

export function categoryFetcher(f: typeof fetch) {
  return (id: string) => {
    const opts = { parser: categoryParser }
    return omerloFetch(f, `${MEDIA_PATH}/categories/${id}`, opts);
  }
}

export interface CategoriesParams extends ListParams {
  limit: number,
}

export function categoriesFetcher(f: typeof fetch) {
  return (params?: CategoriesParams) => {
    const opts = {params: params, parser: parseMany(categoryParser)};
    return omerloFetch(f, `${MEDIA_PATH}/categories`, opts );
  };
}

export function categoryParser(data: ApiData, _assocs: ApiAssocs): Category {
  return {
    id: data.id,
    name: data.localized.name,
    locale: data.localized.locale,
    svgIcon: data.svg_icon
  }
}
