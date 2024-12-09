<script>
  export let data;
</script>

<div class="infinite-scroll">
  {#each data.data as entity}
    <slot {entity} />
  {/each}

  {#if data.meta.next}
    LOAD MORE
  {/if}
</div>
