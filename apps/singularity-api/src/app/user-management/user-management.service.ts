import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { Connection, Repository } from 'typeorm';
import { Nullable } from '@singularity/api-interfaces';
import * as bcrypt from 'bcryptjs';
import { Md5 } from 'ts-md5';
import { MailService } from '../mail/mail.service';
import { CreatePasswordTokenEntity } from './models/create-password-token.entity';

@Injectable()
export class UserManagementService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
              private readonly connection: Connection,
              private readonly mailService: MailService) {
    this.createDefaultUser();
  }

  public async getUserByUsername(username: string): Promise<Nullable<User>> {
    return this.userRepository.findOne({where: {username: username}});
  }

  public async getUserByID(id: number): Promise<Nullable<User>> {
    return this.userRepository.findOne({where: {id: id}});
  }

  public async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  public async resetPassword(email: string): Promise<Nullable<User>> {
    return this.connection.transaction(async manager => {
      const userRepository = manager.getRepository<User>(User);
      const createPasswordTokenRepository = manager.getRepository<CreatePasswordTokenEntity>(CreatePasswordTokenEntity);

      const user = await userRepository.findOne({ where: { email: email } });

      if (user === null) {
        return null;
      }

      const validUntilDate = new Date();
      validUntilDate.setDate(new Date().getDate() + 7);

      const createPasswordToken = createPasswordTokenRepository.create();
      createPasswordToken.user = user;
      createPasswordToken.validUntil = validUntilDate;
      createPasswordToken.token = UserManagementService.generateToken();
      await createPasswordTokenRepository.save(createPasswordToken);

      await this.mailService.sendPasswordResetMail(user, createPasswordToken.token);

      return user;
    });
  }

  public async update(id: number, user: User): Promise<User> {
    const existingUser = await this.getUserByID(id);
    existingUser.username = user.username;
    existingUser.email = user.email;
    existingUser.active = user.active;
    existingUser.profilePictureBase64 = user.profilePictureBase64;
    existingUser.isAdmin = user.isAdmin;

    return this.userRepository.save(existingUser);
  }

  public async setUserInitialPassword(token: string, password: string): Promise<User | undefined> {
    return this.connection.transaction(async manager => {
      const userRepository = manager.getRepository<User>(User);
      const createPasswordTokenRepository = manager.getRepository<CreatePasswordTokenEntity>(CreatePasswordTokenEntity);

      const savedToken = await createPasswordTokenRepository.findOne({ where: { token: token } });
      const user = savedToken.user;

      user.hashedPassword = bcrypt.hashSync(password, 10);
      user.active = true;
      const savedUser = userRepository.save(user);

      await createPasswordTokenRepository.delete(savedToken);

      return savedUser;
    });

  }

  public async createNewUserWithEmail(username: string, email: string, profilePictureBase64: string, isAdmin: boolean): Promise<User | undefined> {
    return this.connection.transaction(async manager => {
      const userRepository = manager.getRepository<User>(User);
      const createPasswordTokenRepository = manager.getRepository<CreatePasswordTokenEntity>(CreatePasswordTokenEntity);

      const user = userRepository.create();
      user.username = username;
      user.email = email;
      user.isAdmin = isAdmin;
      user.profilePictureBase64 = profilePictureBase64;
      user.active = false;
      const createdUser = await userRepository.save(user);

      const validUntilDate = new Date();
      validUntilDate.setDate(new Date().getDate() + 7);

      const createPasswordToken = createPasswordTokenRepository.create();
      createPasswordToken.user = createdUser;
      createPasswordToken.validUntil = validUntilDate;
      createPasswordToken.token = UserManagementService.generateToken();
      await createPasswordTokenRepository.save(createPasswordToken);

      await this.mailService.sendUserConfirmationMail(email, username, createPasswordToken.token);
      return createdUser;
    });
  }

  public async delete(id: number): Promise<User> {
    const existingUser = await this.getUserByID(id);
    const result = await this.userRepository.delete(existingUser.id);
    Logger.log(JSON.stringify(result));
    return existingUser;
  }

  private async createDefaultUser(): Promise<Nullable<User>> {
    if (await this.userRepository.count() > 0) {
      return null;
    }

    const user = this.userRepository.create();
    user.username = 'admin';
    user.email = 'admin@local.host';
    user.active = true;
    user.isAdmin = true;
    user.hashedPassword = bcrypt.hashSync(Md5.hashStr('admin'), 10);

    return this.userRepository.save(user);
  }

  private static generateToken(): string {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 16;

    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

}
