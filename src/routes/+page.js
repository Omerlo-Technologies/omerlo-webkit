import { usePublisher } from '$lib/omerlo';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  // const categories = await usePublisher(fetch).listCategories({limit: 2});

  const titi = await usePublisher(fetch).getContent("f8939d3c-ad1e-4df6-858c-aa828d32f990");
  return { titi };
}
