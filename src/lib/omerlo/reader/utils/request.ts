import { ApiError, parseApiResponse } from '$reader/utils/api';
import type { ApiAssocs, ApiData, ApiResponse } from '$reader/utils/api';
import { BROWSER } from 'esm-env';

type FetchOptions<T> = {
  parser?: (data: ApiData, assocs: ApiAssocs) => T;
  queryParams?: ApiData;
  method?: string;
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
  body?: string;
};

export async function dirtyRequest(
  f: typeof fetch,
  path: string,
  opts: DirtyFetchOptions
): Promise<Response> {
  const queryParams = new URLSearchParams()

  path = `/api/media/v1${path}`;

  if (opts.queryParams) {
    Object.entries(opts.queryParams).forEach(([key, value]) => {
      queryParams.append(key, String(value));
    });

    path = `${path}?${queryParams}`;
  }

  const resp = await f(path.toString(), { method: opts.method, body: opts.body });

  if (BROWSER && resp.headers.get('x-logout') == 'true') {
    const webkitComponent = document.getElementById('omerlo-webkit');

    if (webkitComponent) {
      webkitComponent.dispatchEvent(new Event('logout'));
    }
  }

  if (resp.ok) {
    return resp;
  } else {
    const payload = await resp.json();
    throw new ApiError(resp.status, payload.error, resp.statusText);
  }
}
