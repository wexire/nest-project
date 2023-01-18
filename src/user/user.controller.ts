import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { editUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  edituser(@GetUser('id') userId: number, @Body() dto: editUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
