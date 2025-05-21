import { parseApiResponse } from '$reader/utils/api';
import type { ApiAssocs, ApiData, ApiResponse } from '$reader/utils/api';
import { BROWSER } from 'esm-env';

type FetchOptions<T> = Required<DirtyFetchOptions> & {
  parser: (data: ApiData, assocs: ApiAssocs) => T;
};

function parseRequestOpts<T>(params: Partial<FetchOptions<T>>): FetchOptions<T> {
  const headers: Headers = params.headers ?? new Headers();
  const method: string = params.method ?? 'get';

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (!headers.has('Content-Type') && ['post', 'put', 'patch'].includes(method)) {
    headers.set('Content-Type', 'application/json')
  }

  return {
    queryParams: params.queryParams,
    body: JSON.stringify(params.body),
    method: params.method ?? 'get',
    headers: headers,
    parser: (data: ApiData) => data,
  }
}

export async function request<T>(
  f: typeof fetch,
  path: string,
  opts: Partial<FetchOptions<T>>
): Promise<ApiResponse<T>> {
  const { body, headers, method, queryParams, parser } = parseRequestOpts(opts);

  return dirtyRequest(f, path, { body, headers, method, queryParams }).then(async (resp) => {
    return parseApiResponse(resp, parser);
  });
}

type DirtyFetchOptions = {
  queryParams?: ApiData;
  method?: 'get' | 'post' | 'patch' | 'put' | 'delete';
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
