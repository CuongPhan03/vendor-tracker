import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/config/db.config';
import { UsersService } from 'src/modules/users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { LoginResponseDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      throw new UnauthorizedException("Wrong email or password");

    const valid = await this.verifyPassword(user.password!, password);
    if (!valid)
      throw new UnauthorizedException("Wrong email or password");

    return this.usersService.toUserResponse(user)!;
  }

  async validateAccessTokenPayload(payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    
    if (!user)
      throw new UnauthorizedException("User not found");

    return {
      id: user.id,
      email: user.email,
    };
  }

  async getJwtToken(userId: number): Promise<string> {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync<{ sub: number }>(payload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES') as any ?? '15m',
    });

    if (!accessToken) throw new ServiceUnavailableException("Can not create jwt token");

    return accessToken;
  }

  async login(user: any): Promise<LoginResponseDto> {
    const accessToken = await this.getJwtToken(user['id']);
    const authenticatedUser = await this.usersService.findOneById(user['id']);

    if (!authenticatedUser)
      throw new UnauthorizedException("User not found");

    return {
      accessToken,
      expiredAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      user: authenticatedUser,
    };
  }

}
