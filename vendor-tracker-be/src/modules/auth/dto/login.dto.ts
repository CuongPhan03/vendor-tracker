import { Expose } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';

export class LoginRequestDto {
  @Expose()
  email!: string;

  @Expose()
  password!: string;
}

export class LoginResponseDto {
  @Expose()
  accessToken!: string;

  @Expose()
  expiredAt!: string;

  @Expose()
  user!: UserDto;
}
