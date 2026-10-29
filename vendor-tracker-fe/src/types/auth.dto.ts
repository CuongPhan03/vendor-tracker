import type { UserDto } from "./user.dto";

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  expiredAt: string;
  user: UserDto;
}
