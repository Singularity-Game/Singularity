import {
  Controller,
  Post,
  UseGuards,
  Get,
  UseInterceptors,
  Body,
  Param,
  Put,
  Delete,
  Res, Req
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateInitialPasswordDto,
  CreateUserDto,
  ResetPasswordDto,
  UserDto,
  UUID
} from '@singularity/api-interfaces';
import { AdminGuard } from './guards/admin-guard';
import { User } from './models/user.entity';
import { UserManagementService } from './user-management.service';
import { MapInterceptor, MapPipe } from '@automapper/nestjs';

@Controller('user')
export class UserController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userManagementService: UserManagementService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public login(@Req() request, @Res({ passthrough: true }) response: Response): void {
    const accessToken = this.authenticationService.login(request.user);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 1000)
    }).send({ status: 'ok' })
  }

  @UseInterceptors(MapInterceptor(UserDto, User))
  @Post('setpassword')
  public async setPassword(@Body() createInitialPasswordDto: CreateInitialPasswordDto): Promise<User> {
    return this.userManagementService.setUserInitialPassword(createInitialPasswordDto.token, createInitialPasswordDto.password);
  }

  @UseInterceptors(MapInterceptor(UserDto, User))
  @Post('resetpassword')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.userManagementService.resetPassword(resetPasswordDto.email);
  }

  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(UserDto, User, { isArray: true }))
  @Get()
  public async getAllUsers(): Promise<User[]> {
    return this.userManagementService.getAllUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(UserDto, User))
  @Get('me')
  public getMyUSer(@Req() request: Request): User {
    return request.user as User;
  }

  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(UserDto, User))
  @Get(':id')
  public async getUserById(@Param('id') id: number): Promise<User> {
    return this.userManagementService.getUserByID(id);
  }

  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(UserDto, User))
  @Put(':id')
  public async updateUser(@Param('id') id: number, @Body(MapPipe(UserDto, User)) user: User): Promise<User> {
    return this.userManagementService.update(id, user);
  }

  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(UserDto, User))
  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userManagementService.createNewUserWithEmail(
      createUserDto.username, createUserDto.email, createUserDto.profilePictureBase64 ?? '', createUserDto.isAdmin);
  }

  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(UserDto, User))
  @Delete(':id')
  public async deleteUser(@Param('id') id: number): Promise<User> {
    return this.userManagementService.delete(id);
  }

  private parseJwt<T>(token: string): T | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}
