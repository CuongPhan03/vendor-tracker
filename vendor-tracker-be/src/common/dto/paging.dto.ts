import { IsInt, IsOptional, Min } from 'class-validator';
import { TransformNumber } from '../transform/transform-number';

export class PagingDto {
  @IsOptional()
  @TransformNumber()
  @IsInt()
  @Min(1)
  readonly page?: number = 1;

  @IsOptional()
  @TransformNumber()
  @IsInt()
  @Min(1)
  readonly pageSize?: number = 10;
}
