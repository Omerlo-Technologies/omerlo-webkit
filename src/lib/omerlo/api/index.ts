import { env } from '$env/dynamic/public';
import type { ApiResponse } from '$types/core';
import { omerloFetch } from '..';
import { registerAssocParser } from '../assocs';
import { announcementsFetcher } from './announcement';
import { blockFetcher } from './block';
import { categoryParser, categoriesFetcher } from './category';
import { contentFetcher, contentsFetcher, contentSummaryParser } from './content';

export const OMERLO_PATH = `/api/public/publisher/v2`;
export const MEDIA_PATH = `${OMERLO_PATH}/medias/${env.PUBLIC_MEDIA_ID}`;

export const fetchers = (f: typeof fetch) => {
	return {
		listCategories: categoriesFetcher(f),
		getCategory: categoriesFetcher(f),
		listContents: contentsFetcher(f),
		getContent: contentFetcher(f),
    listAnnouncements: announcementsFetcher(f),
    getAnnouncement: announcementsFetcher(f),
    getBlock: blockFetcher(f),
		loadMore: async <T>(data: ApiResponse<T>) => loadMore<T>(f)(data)
	};
};

function loadMore<T>(f: typeof fetch) {
	return ({ meta: { next }, parser }: ApiResponse<T>) => {
		if (next == null) {
			throw new Error('meta.next is null');
		}

		const opts = { parser: parser };
		return omerloFetch(f, next, opts);
	};
}

registerAssocParser('categories', categoryParser);
registerAssocParser('contents', contentSummaryParser);
