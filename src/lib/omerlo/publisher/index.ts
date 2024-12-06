import { env } from '$env/dynamic/public';
import { registerAssocParser } from '../assocs';
import { categoryParser, categoriesFetcher } from './category';
import { contentFetcher, contentSummaryParser } from './content';

const PUBLISHER_URL = `${env.PUBLIC_BASE_URL}/api/public/publisher/v2`;
export const MEDIA_URL = `${PUBLISHER_URL}/medias/${env.PUBLIC_MEDIA_ID}`

export const fetchers = (f: typeof fetch) => {
  return {
    listCategories: categoriesFetcher(f),
    getCategory: categoriesFetcher(f),
    getContent: contentFetcher(f)
  }
}

registerAssocParser('categories', categoryParser);
// registerAssocParser('profiles', profileSummaryParser);
registerAssocParser('contents', contentSummaryParser);

