# Omerlo WebKit

This webkit is a wapper arround Omerlo's API to create quickly a website using Omerlo.

## Examples

You can easily fetch data from Omerlo in your `+page.ts` (and `+page.server.ts` too). Every call using the `useReader`
helper guarantee hydration to works properly.

```ts
// +page.ts
import type { PageLoad } from './$types';
import { useReader } from '$lib/omerlo';

export const load: PageLoad = async ({ fetch }) => {
  const oauthProviders = await useReader(fetch).listOauthProviders();
  return { oauthProviders };
};
```

Or if

```ts
<script lang="ts">
  import { useReader } from "$omerlo";

  async function checkAccessToken() {
    const resp = await useReader(fetch).listOauthProviders()
    console.log(resp);
  }
</script>

<button onclick={checkAccessToken}> Check access token</button>
```

## Installation

```sh
PRIVATE_OMERLO_HOST='cms.omerlo.com'
PRIVATE_OMERLO_PROTOCOL='https'
PRIVATE_OMERLO_CLIENT_ID='<CLIENT_ID>'
PRIVATE_OMERLO_CLIENT_SECRET='<CLIENT_SECRET>'
```

```ts
// in your hooks.server.ts

import { readerProxyHook } from 'omerlo/server'

export const handle = readerProxyHook;
```

## Cookbook

To automatically add the `locale` to all request made to the CMS, you can create a server hook to append this
parameter.

```ts
// in your hooks.server.ts
import type { Handle } from "@sveltejs/kit";

import { readerProxyHook } from 'omerlo/server';
import { sequence } from "@sveltejs/kit/hooks";

const handleLocale: Handle = async ({ event, resolve }) => {
    const userLocale = 'en'; // you can fetch this value from cookie or w.e
    event.url.searchParams.append('locale', userLocale);
    return resolve(event);
}

export const handle = sequence(handleLocale, readerProxyHook);
```

> This will append the locale 'en' to any request made BY the server.
