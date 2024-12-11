<script lang="ts" generics="T">
	import { useOmerlo } from '$lib/omerlo';
	import type { ApiResponse } from '$types/core';
	import { onMount } from 'svelte';

	export let data: ApiResponse<T[]>;
	let entities = data.data;
	let newEntities: T[] = [];

	let loadMoreDiv: HTMLDivElement;
	let observer: IntersectionObserver;
	let isLoading = false;

	onMount(() => {
		observer = new IntersectionObserver((e) => void loadMore(e));
		observer.observe(loadMoreDiv);
		return () => observer?.disconnect();
	});

	async function loadMore(entries: IntersectionObserverEntry[]) {
		if (!entries.some((element) => element.isIntersecting)) {
			return;
		}
		if (data.meta.next == null) {
			return;
		}

		isLoading = true;

		data = await useOmerlo(fetch)
			.loadMore<T[]>(data)
			.finally(() => (isLoading = false));

		newEntities = data.data;
	}

	$: entities = [...entities, ...newEntities];
</script>

<div>
	{#each entities as entity}
		<slot {entity} />
	{/each}

	<div bind:this={loadMoreDiv}></div>
</div>
