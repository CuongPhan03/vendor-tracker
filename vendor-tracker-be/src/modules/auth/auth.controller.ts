import {
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import type { Request } from 'express';
import { SkipJwtAuth } from 'src/annotations/skipAuth.annotation';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserDto } from '../users/dto/user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @SkipJwtAuth()
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request): Promise<LoginResponseDto> {
    return this.authService.login((req as any).user);
  }

  @Get('me')
  async profile(@Req() req: Request): Promise<UserDto> {
    const user = await this.usersService.findOneById((req as any).user['id']);
    if (!user)
      throw new NotFoundException("User not found");

    return user;
  }
}
