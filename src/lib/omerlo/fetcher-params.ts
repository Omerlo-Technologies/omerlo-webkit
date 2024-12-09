export interface ApiParams {
  locale?: string | null,
}

export interface ListParams extends ApiParams {
  limit?: number | null,
  after?: string | null,
  before?: string | null,
}
