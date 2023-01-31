export interface Response<T> {
  return_code: string;
  data: T;
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  per_page: number;
  count: number;
}
