import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";
import { setCookie } from "../utils/cookie";

export function useLogin() {
  const navigate = useNavigate();
  const setUser = useUserStore(state => state.setUser);

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setCookie('accessToken', data.accessToken)
      setUser(data.user);
      navigate("/", { replace: true });
    },
    onError: () => alert('Wrong email or password')
  });

  return mutation;
}
