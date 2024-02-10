import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailTemplate } from './entities/mail-template.entity';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([MailTemplate])],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
