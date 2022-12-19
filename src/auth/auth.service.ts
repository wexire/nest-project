import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new ForbiddenException('Credentials incorrect');

      const pwMatch = await verify(user.passwordHash, dto.password);

      if (!pwMatch) throw new ForbiddenException('Credentials incorrect');

      delete user.passwordHash;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async signup(dto: AuthDto) {
    try {
      const passwordHash = await hash(dto.password);

      const user = await this.prisma.user.create({
        data: { email: dto.email, passwordHash },
      });

      delete user.passwordHash;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }
}
