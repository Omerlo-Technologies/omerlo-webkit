import { parseApiResponse } from '$reader/utils/api';
import type { ApiAssocs, ApiData, ApiResponse } from '$reader/utils/api';
import { BROWSER } from 'esm-env';

type FetchOptions<T> = {
  parser?: (data: ApiData, assocs: ApiAssocs) => T;
  queryParams?: ApiData;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: ApiData;
  headers?: Headers;
};

export async function request<T>(
  f: typeof fetch,
  path: string,
  opts: FetchOptions<T>
): Promise<ApiResponse<T>> {
  const parser = opts.parser || ((data) => data);

  const body = JSON.stringify(opts.body);
  const headers = opts.headers;
  const method = opts.method ?? 'get';
  const queryParams = opts.queryParams;

  // Enforce JSON content type for posts
  if (!opts.headers) {
    opts.headers = new Headers();
  } 
  if (!opts.headers.get('Content-Type')) opts.headers.set('Content-Type', 'application/json');


  return dirtyRequest(f, path, { body, headers, method, queryParams }).then(async (resp) => {
    return parseApiResponse(resp, parser);
  });
}

type DirtyFetchOptions = {
  queryParams?: ApiData;
  method?: 'get' | 'post' | 'put' | 'delete';
  body?: ApiData;
  headers?: Headers;
};

export async function dirtyRequest(
  f: typeof fetch,
  path: string,
  opts: DirtyFetchOptions
): Promise<Response> {
  const queryParams = new URLSearchParams()

  path = `/api/media/v1${path}`;

  if (opts?.queryParams) {
    Object.entries(opts.queryParams).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    path = `${path}?${queryParams}`;
  }

  const resp = await f(path.toString(), opts);

  if (BROWSER && resp.headers.get('x-logout') == 'true') {
    const webkitComponent = document.getElementById('omerlo-webkit');

    if (webkitComponent) {
      webkitComponent.dispatchEvent(new Event('logout'));
    }
  }

  return resp;
}
