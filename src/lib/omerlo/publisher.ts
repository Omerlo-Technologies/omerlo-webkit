import { env } from '$env/dynamic/public';
import type { ApiData, Category } from "$types/core";
import { omerloFetch, parseMany } from '.';

const PUBLISHER_URL = `${env.PUBLIC_BASE_URL}/api/public/publisher/v2`;
const MEDIA_URL = `${PUBLISHER_URL}/medias/${env.PUBLIC_MEDIA_ID}`

export default (f: typeof fetch) => {
  return {
    listCategories: categoriesFetcher(f),
    getCategory: categoryFetcher(f)
  }
}

function categoryFetcher(f: typeof fetch) {
  return (id: string) => {
    const opts = { parser: categoryParser }
    return omerloFetch(f, `${MEDIA_URL}/categories/${id}`, opts);
  }
}

type CategoriesParams = {
  limit: number,
}

function categoriesFetcher(f: typeof fetch) {
  return (params?: CategoriesParams) => {
    const opts = {params: params, parser: parseMany(categoryParser)};
    return omerloFetch(f, `${MEDIA_URL}/categories`, opts );
  }
}

function categoryParser(category: ApiData): Category {
  return {
    id: category.id,
    name: category.localized.name,
    locale: category.locale,
    svg_icon: category.svg_icon
  }
}
