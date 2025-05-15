import { parseApiResponse } from '$reader/utils/api';
import type { ApiAssocs, ApiData, ApiResponse } from '$reader/utils/api';
import { BROWSER } from 'esm-env';

type FetchOptions<T> = {
  parser?: (data: ApiData, assocs: ApiAssocs) => T;
  queryParams?: ApiData;
  method?: string;
  body?: ApiData;
};

export async function request<T>(
  f: typeof fetch,
  path: string,
  opts: FetchOptions<T>
): Promise<ApiResponse<T>> {
  const parser = opts.parser || ((data) => data);
  return dirtyRequest(f, path, opts).then(async (resp) => {
    return parseApiResponse(resp, parser);
  });
}

type DirtyFetchOptions = {
  queryParams?: ApiData;
  method?: string;
  body?: ApiData;
};

export async function dirtyRequest(
  f: typeof fetch,
  path: string,
  opts?: DirtyFetchOptions
): Promise<Response> {
  const queryParams = new URLSearchParams()

  path = `/api/media/v1${path}`;

  if (opts?.queryParams) {
    Object.entries(opts.queryParams).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    path = `${path}?${queryParams}`;
  }

  const headers = { 'Content-Type': 'application/json' }
  const resp = await f(path.toString(), { method: opts?.method ?? 'get', body: JSON.stringify(opts?.body), headers });

  if (BROWSER && resp.headers.get('x-logout') == 'true') {
    const webkitComponent = document.getElementById('omerlo-webkit');

    if (webkitComponent) {
      webkitComponent.dispatchEvent(new Event('logout'));
    }
  }

  return resp;
}
