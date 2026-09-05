import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import express from 'express';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateInitialPasswordDto, CreateUserDto, ResetPasswordDto, UserDto } from '@singularity/api-interfaces';
import { AdminGuard } from './guards/admin-guard';
import { User } from './models/user.entity';
import { UserManagementService } from './user-management.service';
import { UserMapper } from './mapper/user-mapper.service';
import type { RequestWithUser } from './types/request-with-user';

@Controller('user')
export class UserController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userManagementService: UserManagementService,
    private readonly userMapper: UserMapper
  ) {
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  public login(@Req() request, @Res({passthrough: true}) response: express.Response): void {
    const accessToken = this.authenticationService.login(request.user);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 1000)
    }).send({status: 'ok'})
  }

  @Post('setpassword')
  public async setPassword(@Body() createInitialPasswordDto: CreateInitialPasswordDto): Promise<UserDto> {
    const user = await this.userManagementService.setUserInitialPassword(createInitialPasswordDto.token, createInitialPasswordDto.password);
    return this.userMapper.mapToDto(user);
  }

  @Post('resetpassword')
  public async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<void> {
    await this.userManagementService.resetPassword(resetPasswordDto.email);
  }

  @UseGuards(AdminGuard())
  @Get()
  public async getAllUsers(): Promise<UserDto[]> {
    const users = await this.userManagementService.getAllUsers();
    return users.map(user => this.userMapper.mapToDto(user));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  public getMyUSer(@Req() request: RequestWithUser): UserDto {
    return this.userMapper.mapToDto(request.user as User);
  }

  @UseGuards(AdminGuard())
  @Get(':id')
  public async getUserById(@Param('id') id: number): Promise<UserDto> {
    const user = await this.userManagementService.getUserByID(id);

    if (!user) {
      throw new Error('User not found')
    }

    return this.userMapper.mapToDto(user);
  }

  @UseGuards(AdminGuard())
  @Put(':id')
  public async updateUser(@Param('id') id: number, @Body() userDto: UserDto): Promise<UserDto> {
    const user = this.userMapper.mapToEntity(userDto);
    const updatedUser = await this.userManagementService.update(id, user);
    return this.userMapper.mapToDto(updatedUser);
  }

  @UseGuards(AdminGuard())
  @Post()
  public async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userManagementService.createNewUserWithEmail(
      createUserDto.username, createUserDto.email, createUserDto.profilePictureBase64 ?? '', createUserDto.isAdmin ?? false);

    return this.userMapper.mapToDto(user);
  }

  @UseGuards(AdminGuard())
  @Delete(':id')
  public async deleteUser(@Param('id') id: number): Promise<UserDto> {
    const user = await this.userManagementService.delete(id);
    return this.userMapper.mapToDto(user);
  }
}
