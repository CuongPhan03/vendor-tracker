import type { PagingDto } from "../types/paging.dto";
import type {
  UpdateVendorDto,
  VendorListDto,
} from "../types/vendor.dto";
import type { StageHistoryListDto } from "../types/stage-history.dto";
import axiosClient from "../utils/axios";

export const vendorsApi = {
  list: async (params?: PagingDto): Promise<VendorListDto> =>
    await axiosClient.get<void, VendorListDto>("/vendors", {
      params,
    }),

  update: async (
    id: number,
    payload: UpdateVendorDto,
  ): Promise<boolean> =>
    await axiosClient.patch<UpdateVendorDto, boolean>(
      `/vendors/${id}`,
      payload,
    ),

  history: async (
    id: number,
    params?: PagingDto,
  ): Promise<StageHistoryListDto> =>
    await axiosClient.get<void, StageHistoryListDto>(
      `/vendors/${id}/history`,
      { params },
    ),
};