import { initAssocs, parseAssocs, type Assoc } from './assocs';

export type ApiAssocs = Record<string, Assoc>;

export async function parseApiResponse<T>(
  response: Response,
  parser: (data: ApiData, assocs: ApiAssocs) => T
): Promise<ApiResponse<T>> {
  const text = await response.text();

  if (response.ok) {
    const payload = JSON.parse(text);
    let assocs = initAssocs(payload.assocs);
    assocs = parseAssocs(assocs);
    const meta = payload.meta;
    const data = parser(payload.data, assocs);
    const errors = payload.errors || [];
    return { ok: true, status: response.status, parser, meta, data, errors };
  }

  // Response not OK - try to parse JSON for API errors, fallback to generic error
  let errors: ApiData[] = [];
  try {
    const payload = JSON.parse(text);
    errors = payload.errors || [];
  } catch {
    console.error('[OmerloWebkit - parseApiResponse] Non-OK response with non-JSON body', {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      body: text.slice(0, 1000)
    });
    errors = [{ message: `${response.status} ${response.statusText}`, body: text.slice(0, 500) }];
  }

  return { ok: false, status: response.status, parser, meta: null, data: null, errors };
}

export function parseMany<T>(
  parser: (data: ApiData, assocs: ApiAssocs) => T
): (response: ApiData[], assocs: ApiAssocs) => T[] {
  return (response: ApiData[], assocs: ApiAssocs) => {
    return response.map((data) => parser(data, assocs));
  };
}

export interface ApiResponse<T> {
  ok: boolean;
  errors: ApiData[];
  status: number;
  parser: (data: ApiData, assocs: ApiAssocs) => T;
  data: T | null;
  meta: ApiResponseMeta | null;
}

export interface ApiResponseMeta {
  base: string;
  next: string | null;
  previous: string | null;
}

export interface ApiParams {
  locale?: string | null;
}

export interface PagingParams extends ApiParams {
  limit?: number | null;
  after?: string | null;
  before?: string | null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiData = any;

export class ApiError extends Error {
  public readonly status;
  public readonly payload;

  public constructor(status: number, payload: any, ...params: any[]) {
    super(...params);
    this.status = status;
    this.payload = payload;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
