import { VendorStage } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateVendorDto {
  @IsEnum(VendorStage)
  stage!: VendorStage;
}
