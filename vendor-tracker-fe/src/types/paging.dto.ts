export type PagingDto = {
  page?: number;
  pageSize?: number;
};

export type PagingResultDto<T> = {
  items: T[];
  count: number;
  currentPage: number;
  totalPages: number;
};
