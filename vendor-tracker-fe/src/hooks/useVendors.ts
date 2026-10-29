import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vendorsApi } from "../api/vendors";
import type { PagingDto } from "../types/paging.dto";
import type { UpdateVendorDto } from "../types/vendor.dto";
import type { AxiosError } from "axios";

export function useGetVendors(params?: PagingDto) {
  return useQuery({
    queryKey: ["vendors", params],
    queryFn: async () => await vendorsApi.list(params),
  });
}

export function useGetVendorHistory(id: number, params?: PagingDto) {
  return useQuery({
    queryKey: ["vendors", id, "history", params],
    queryFn: async () => await vendorsApi.history(id, params),
    enabled: id > 0,
  });
}

export function useUpdateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateVendorDto }) => vendorsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendors", variables.id, "history"] });
    },
    onError: (e: AxiosError<{ message: string }>) => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      alert(e.response?.data?.message);
    }
  });
}