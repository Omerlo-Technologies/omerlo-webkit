# Omerlo WebKit

This webkit is a wapper arround Omerlo's API to create quickly a website using Omerlo.

The user's session and tokens will be managed by Omerlo Webkit. The connection state is dispatched
over all window's tab, no need to refresh other tabs.

## Using the omerlo webkit

Install the package `omerlo-webkit`

```sh
npm i @omerlo/omerlo-webkit
```

### Create the .env

Copy the `.env.dist` to `.env` then update its values to match your Omerlo's application informations.

### Create the server's hooks

Create (or update) the file `src/hooks.server.ts` and add required hooks as follow

```ts
import type { Handle } from '@sveltejs/kit';

import { handleUserToken, handleReaderApi } from 'omerlo-webkit/reader/server';
import { sequence } from '@sveltejs/kit/hooks';

// You can add custom hooks too
const handleLocale: Handle = async ({ event, resolve }) => {
  const userLocale = 'en'; // you can fetch this value from cookie or w.e
  event.url.searchParams.append('locale', userLocale);
  return resolve(event);
};

export const handle = sequence(handleLocale, handleUserToken, handleReaderApi);
```

### Layout `layout.server.ts`

To automatically load the user session, you have to load the user's session as following

```ts
// +layout.server.ts
import type { LayoutServerLoad } from './$types';

import { loadUserSession } from 'omerlo-webkit/reader/server';
import { type UserSession } from 'omerlo-webkit/reader';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
  const userSession: UserSession = await loadUserSession(fetch, cookies);

  return { userSession };
};
```

Then you need to use the component `OmerloWebkit` and give him the `userSession` previously loaded.

```ts
// +layout.svelte
<script lang="ts">
  import { OmerloWebkit } from 'omerlo-webkit'
  let { data, children } = $props();
</script>

<OmerloWebkit userSession={data.userSession}>
  {@render children?.()}
</OmerloWebkit>
```

### Use Reader API

To use reader API, you can use the function `useReader` passing the sveltekit `fetch` function.

```ts
// +page.ts
import type { PageLoad } from './$types';
import { useReader } from 'omerlo-webkit';

export const load: PageLoad = async ({ fetch }) => {
  const oauthProviders = await useReader(fetch).listOauthProviders();
  return { oauthProviders };
};
```

## Connecting user using Oauth Provider (such as Google).

You'll need to create a login endpoint to add some required params such as the `state`.

```ts
// +server.ts
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';

export const GET: RequestHandler = ({ url }) => {
  const oauthUrl = url.searchParams.get('oauthUrl');
  const oauthProviderId = url.searchParams.get('oauthProviderId');

  if (!oauthUrl) error(400, 'Missing oauthUrl query parameter');
  if (!oauthProviderId) error(400, 'Missing oauthProviderId query parameter');

  const currentPath = url.searchParams.get('currentPath') || '/';
  const state = jwt.sign({ currentPath, oauthProviderId }, env.PRIVATE_JWT_SECRET, {
    expiresIn: '1h'
  });

  const redirectUrl = new URL(oauthUrl);
  redirectUrl.searchParams.set('state', state);
  redirectUrl.searchParams.set('redirect_uri', url.origin + '/oauth/callback');

  redirect(302, redirectUrl);
};
```

And then create a callback action.

```ts
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jwt from 'jsonwebtoken';
import { exchangeAuthorizationCode, setAuthorizationCookies } from 'omerlo-webkit/reader/server';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const redirectUri = url.origin + url.pathname;
  const state = getRequiredQueryParams(url, 'state');
  const code = getRequiredQueryParams(url, 'code');
  const { oauthProviderId, currentPath } = parseJwt(state);

  try {
    const token = await exchangeAuthorizationCode({ code, redirectUri, oauthProviderId });
    setAuthorizationCookies(cookies, token);
  } catch (_err) {
    error(401, 'Could not authenticate from the provider');
  }

  redirect(303, currentPath);
};

function getRequiredQueryParams(url: URL, paramsName: string): string {
  const value = url.searchParams.get(paramsName);

  if (!value) {
    error(400, `Missing ${paramsName}`);
  }

  return value;
}

interface State {
  oauthProviderId: string;
  currentPath: string;
}

function parseJwt(state: string): State {
  try {
    return jwt.verify(state, env.PRIVATE_JWT_SECRET) as State;
  } catch (_err) {
    error(400, 'Invalid state');
  }
}
```

## Logout your user

To logout your user you can create an endpoint that will drop cookies used for authentication.

```ts
// +server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { clearAuthorizationCookies } from 'omerlo-webkit/reader/server';

export const DELETE: RequestHandler = ({ cookies }) => {
  clearAuthorizationCookies(cookies);
  return json(201);
};
```

When a user is logout for any reason (401 or manually logout), the `invalidate('omerlo:user_session)` is triggered,
allowing you to reload component / page that have `depends('omerlo:user_session)`.

Plus the user's session store is updated cross tabs. It mean the user will be logout from every tabs.

## Use user's informations

```ts
<script lang="ts">
  import { getUserSession } from 'omerlo-webkit/reader';

  let { data } = $props();
  const userSession = getUserSession();
</script>

<!-- Some token may not be linked to a reader accounts -->
<!-- In that case, the user will be null -->
{#if $userSession.user}
  Your name: {$userSession.user?.name}
{/if}

{#if $userSession.verified}
  <div> You has been verified </div>
{/if}

{#if $userSession.authenticated}
  <div> You has been authenticated </div>
{/if}
```
