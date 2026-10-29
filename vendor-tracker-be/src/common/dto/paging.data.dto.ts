import { Expose } from 'class-transformer';

export class PagingDataDto {
  @Expose()
  count: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}
