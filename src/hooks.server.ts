import type { Handle } from "@sveltejs/kit";

import { Reader } from '$omerlo/server';
import { sequence } from "@sveltejs/kit/hooks";

const handleLocale: Handle = async ({ event, resolve }) => {
    const userLocale = 'en'; // you can fetch this value from cookie or w.e
    event.url.searchParams.append('locale', userLocale);
    return resolve(event);
}

export const handle = sequence(handleLocale, Reader.handleUserToken, Reader.proxyHook);
