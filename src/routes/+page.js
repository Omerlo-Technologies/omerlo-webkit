import { useOmerlo } from '$lib/omerlo';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const contents = await useOmerlo(fetch).listContents();

	return { contents };
}
