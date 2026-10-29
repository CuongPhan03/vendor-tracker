import type { UserDto } from "../types/user.dto";
import axiosClient from "../utils/axios";

export const usersApi = {
  list: async (): Promise<UserDto[]> => await axiosClient.get<void, UserDto[]>("/users")
};