<script>
	import InfiniteScroll from '$lib/components/InfiniteScroll.svelte';

  let { data } = $props();
</script>

<InfiniteScroll let:entity={content} data={data.contents}>
  <div>
    {@html content.titleHtml}
  </div>
</InfiniteScroll>
