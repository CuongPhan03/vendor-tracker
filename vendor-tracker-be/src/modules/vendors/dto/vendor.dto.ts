import { VendorStage } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { PagingDataDto } from 'src/common/dto/paging.data.dto';

export class VendorDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  region!: string;

  @Expose()
  stage!: VendorStage;

  @Expose()
  coordinatorId!: number;

  @Expose()
  coordinatorName?: string;
  
  @Expose()
  isStuck?: boolean;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;
}

export class VendorListDto extends PagingDataDto {
  @Expose()
  @Type(() => VendorDto)
  items!: VendorDto[];
}
