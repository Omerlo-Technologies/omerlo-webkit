<script lang="ts">
  import { OmerloWebkit } from 'omerlo-webkit';
  let { data, children } = $props();
</script>

<OmerloWebkit userSession={data.userSession}>
  {@render children?.()}
</OmerloWebkit>
