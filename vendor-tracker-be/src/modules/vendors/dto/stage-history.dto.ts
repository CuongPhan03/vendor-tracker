import { VendorStage } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { PagingDataDto } from 'src/common/dto/paging.data.dto';

export class StageHistoryDto {
  @Expose()
  id!: number;

  @Expose()
  vendorId!: number;

  @Expose()
  changedById!: number;

  @Expose()
  previousStage!: VendorStage;

  @Expose()
  newStage!: VendorStage;

  @Expose()
  changedAt!: Date;

  @Expose()
  changedByName?: string;
}

export class StageHistoryListDto extends PagingDataDto {
  @Expose()
  @Type(() => StageHistoryDto)
  items!: StageHistoryDto[];
}