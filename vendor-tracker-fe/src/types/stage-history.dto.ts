import type { PagingResultDto } from "./paging.dto";
import type { VendorStage } from "./vendor.dto";

export interface StageHistoryDto {
  id: number;
  vendorId: number;
  changedById: number;
  previousStage: VendorStage;
  newStage: VendorStage;
  changedAt: string;
  changedByName?: string;
}

export type StageHistoryListDto = PagingResultDto<StageHistoryDto>;
