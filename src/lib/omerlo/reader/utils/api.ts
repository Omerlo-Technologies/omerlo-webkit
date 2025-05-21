import { parseAssocs, type Assoc } from './assocs';

export type ApiAssocs = Record<string, Record<string, Assoc>>;

export async function parseApiResponse<T>(
  response: Response,
  parser: (data: ApiData, assocs: ApiAssocs) => T
): Promise<ApiResponse<T>> {
  const payload = await response.json();
  let data = null,
    meta = null;

  if (response.ok) {
    parseAssocs(payload.assocs);
    meta = payload.meta;
    data = parser(payload.data, payload.assocs);
  }

  const errors = payload.errors || [];

  return { ok: response.ok, status: response.status, parser, meta, data, errors };
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
  next: string | null;
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
