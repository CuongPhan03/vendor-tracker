import { Controller, Get } from '@nestjs/common';
import { SkipJwtAuth } from 'src/annotations/skipAuth.annotation';
import { UsersService } from '../users/users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @SkipJwtAuth()
  async login(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }
}
