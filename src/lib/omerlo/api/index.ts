import { env } from '$env/dynamic/public';
import type { ApiResponse } from '$types/core';
import { omerloFetch, parseMany } from '..';
import { registerAssocParser } from '../assocs';
import { categoryParser, categoriesFetcher } from './category';
import { contentFetcher, contentsFetcher, contentSummaryParser } from './content';

const OMERLO_PATH = `/api/public/publisher/v2`;
export const MEDIA_PATH = `${OMERLO_PATH}/medias/${env.PUBLIC_MEDIA_ID}`

export const fetchers = (f: typeof fetch) => {

  return {
    listCategories: categoriesFetcher(f),
    getCategory: categoriesFetcher(f),
    getContent: contentFetcher(f),
    listContents: contentsFetcher(f),
    loadMore: async <T>(data: ApiResponse<T>) => loadMore<T>(f)(data)
  }
}

function loadMore<T>(f: typeof fetch) {
  return ({ meta: { next }, parser }: ApiResponse<T>) => {
    if (next == null) { throw new Error("meta.next is null"); }

    const opts = { parser: parser }
    return omerloFetch(f, next, opts);
  }
}

registerAssocParser('categories', categoryParser);
registerAssocParser('contents', contentSummaryParser);

