import { env } from '$env/dynamic/public';
import { registerAssocParser } from '../assocs';
import { categoryParser, categoriesFetcher } from './category';
import { contentFetcher, contentsFetcher, contentSummaryParser } from './content';

const OMERLO_URL = `${env.PUBLIC_BASE_URL}/api/public/publisher/v2`;
export const MEDIA_URL = `${OMERLO_URL}/medias/${env.PUBLIC_MEDIA_ID}`

export const fetchers = (f: typeof fetch) => {

  return {
    listCategories: categoriesFetcher(f),
    getCategory: categoriesFetcher(f),
    getContent: contentFetcher(f),
    listContents: contentsFetcher(f)
  }
}

registerAssocParser('categories', categoryParser);
registerAssocParser('contents', contentSummaryParser);

