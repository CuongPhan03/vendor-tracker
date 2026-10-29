import {
  Injectable
} from '@nestjs/common';
import { PrismaService } from 'src/config/db.config';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  toUserResponse(user: any): UserDto | null {
    if (!user)
      return null;

    const { password, ...userResponse } = user;
    return userResponse;
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => ({ ...user, password: '123456' }));
  }

  async findOneByEmail(email: string): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return this.toUserResponse(user);
  }

  async findOneById(id: number): Promise<UserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });

    return this.toUserResponse(user);
  }
}
