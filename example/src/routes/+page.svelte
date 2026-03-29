<script lang="ts">
  import { page } from '$app/state';
  import type { OauthProviderSummary } from 'omerlo-webkit/reader';
  import { getUserSession } from 'omerlo-webkit/reader';

  let { data } = $props();

  function getCallbackUrl(oauthProvider: OauthProviderSummary): string {
    const params = new URLSearchParams();
    params.append('oauthUrl', oauthProvider.authenticateUrl);
    params.append('oauthProviderId', oauthProvider.id);
    params.append('currentUrl', page.url.pathname);
    return `/oauth/login?${params}`;
  }

  const userSession = getUserSession();

  async function logout() {
    await fetch('/session', { method: 'delete' });
    userSession.handleLogout();
  }
</script>

<h1>Hello Webkit!</h1>

{#if $userSession.user}
  Your name: {$userSession.user?.name}
{:else}
  User is not connected
{/if}

{#if $userSession.verified}
  <button type="button" onclick={userSession.refresh}> Refresh my informations </button>
{/if}

{#if !$userSession.authenticated}
  {#each data.oauthProviders.data as oauthProvider}
    <div>
      <a href={getCallbackUrl(oauthProvider)}>
        Sign in with {oauthProvider.type}
      </a>
    </div>
  {/each}
{/if}

{#if $userSession.authenticated}
  <div>
    <button type="button" onclick={logout}> Logout </button>
  </div>
{/if}
