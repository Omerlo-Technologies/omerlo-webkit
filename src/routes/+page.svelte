<script>
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';
	import { useOmerlo } from '$lib/omerlo';

  let { data } = $props();

  let isLoading = false;

  /**
   * @param {string | null} next
   */
  async function loadMore(next) {
    if (isLoading) { return ;}
    if (next == null) { return; }

    isLoading = true;

    const newContents = await useOmerlo(fetch).listContents({ after: data.contents.meta.next });
    data.contents.data.concat(newContents.data);
    data.contents.meta = newContents.meta;
    isLoading = false;
  }
</script>

<InfiniteScroll let:entity={content} data={data.contents}>
  <div>
    {content.id}
  </div>
</InfiniteScroll>
