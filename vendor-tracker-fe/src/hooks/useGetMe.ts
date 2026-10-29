import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { useUserStore } from "../stores/userStore";
import type { AxiosError } from "axios";
import { removeCookie } from "../utils/cookie";
import { useEffect } from "react";

export function useGetMe() {
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);
  
  const mutation = useMutation({
    mutationFn: authApi.me,
    onSuccess: (user) => setUser(user),
    onError: (e: AxiosError) => {
      console.log({e})
      if (e.status === 401) {
        clearUser();
        removeCookie('accessToken');
      }
    }
  });

  useEffect(() => {
    mutation.mutate();
  }, []);

  return mutation;
}
