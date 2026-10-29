import type { LoginDto, LoginResponseDto } from "../types/auth.dto";
import type { UserDto } from "../types/user.dto";
import axiosClient from "../utils/axios";

export const authApi = {
  login: async (payload: LoginDto): Promise<LoginResponseDto> => 
    await axiosClient.post<LoginDto, LoginResponseDto>(
      "/auth/login",
      payload,
    ),

  me: async (): Promise<UserDto> => await axiosClient.get<void, UserDto>("/auth/me")
};
