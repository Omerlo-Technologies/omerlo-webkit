<script lang="ts">
  import { initUserSession, type UserSession } from '$omerlo/reader/stores/user_session';
  import { onDestroy, onMount } from 'svelte';

  export let userSession: UserSession;
  let selfComponent: HTMLDivElement;

  const _userSession = initUserSession(userSession);

  onMount(() => {
    selfComponent.addEventListener('logout', () => {
      _userSession.handleLogout();
    });
  });

  onDestroy(() => {
    if (selfComponent) {
      selfComponent.removeEventListener('logout', _userSession.handleLogout, true);
    }
  });
</script>

<div id="omerlo-webkit" bind:this={selfComponent}>
  <slot></slot>
</div>
