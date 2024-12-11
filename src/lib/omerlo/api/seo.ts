import type { Seo } from '$types/composer';
import type { ApiData } from '$types/core';

export function seoParser(data: ApiData, _assocs: ApiData = {}): Seo {
	return {
		title: data.title,
		description: data.description
	};
}
