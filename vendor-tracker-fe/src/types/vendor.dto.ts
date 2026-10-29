import type { PagingResultDto } from "./paging.dto";

export type VendorStage =
  | "CONTRACT_SENT"
  | "CONTRACT_SIGNED"
  | "KYC_DOCS_RECEIVED"
  | "KYC_VERIFIED"
  | "ACTIVE";

export interface VendorDto {
  id: number;
  name: string;
  region: string;
  stage: VendorStage;
  coordinatorId: number;
  coordinatorName?: string;
  isStuck?: boolean;
  stageEnteredAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export type VendorListDto = PagingResultDto<VendorDto>;

export interface UpdateVendorDto {
  stage: VendorStage;
}