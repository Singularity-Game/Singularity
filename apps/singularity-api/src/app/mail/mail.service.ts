import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailTemplate } from './entities/mail-template.entity';
import { Repository } from 'typeorm';
import { MailType } from './types/mail-type';
import { DEFAULT_MAIL_TEMPLATES } from './defaults/default-mail-templates';
import { User } from '../user-management/models/user.entity';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private readonly configService: ConfigService,
              @InjectRepository(MailTemplate) private readonly mailTemplateRepository: Repository<MailTemplate>) {

    this.saveDefaultTemplatesToDatabase();

    this.transporter = createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: Number(this.configService.get('SMTP_PORT')),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USERNAME'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  public async sendUserConfirmationMail(email: string, username: string, token: string): Promise<boolean> {
    const url = `${this.configService.get('APP_URL')}/authentication/set-password?token=${token}`;
    const from = this.configService.get('SMTP_FROM');
    const template = await this.mailTemplateRepository.findOne({ where: { type: MailType.CreatePassword } });

    const mailText = this.setMailTemplateTextVars(template.textTemplate, {
      url: url,
      username: username
    });

    const mailHtml = this.setMailTemplateTextVars(template.htmlTemplate, {
      url: url,
      username: username
    })

    await this.transporter.sendMail({
      to: email,
      from: from,
      subject: template.subject,
      text: mailText,
      html: mailHtml,
    });

    return true;
  }

  public async sendPasswordResetMail(user: User, token: string): Promise<boolean> {
    const url = `${this.configService.get('APP_URL')}/authentication/set-password?token=${token}`;
    const from = this.configService.get('SMTP_FROM');
    const template = await this.mailTemplateRepository.findOne({ where: { type: MailType.ResetPassword } });

    const mailText = this.setMailTemplateTextVars(template.textTemplate, {
      url: url,
      username: user.username
    });

    const mailHtml = this.setMailTemplateTextVars(template.htmlTemplate, {
      url: url,
      username: user.username
    })

    await this.transporter.sendMail({
      to: user.email,
      from: from,
      subject: template.subject,
      text: mailText,
      html: mailHtml,
    });

    return true;
  }

  private setMailTemplateTextVars(text: string | null, vars: Record<string, string>): string | null {
    if(!text) {
      return null;
    }

    Object.keys(vars).forEach((key: string) => {
      text = text.replace(`{{${key}}}`, vars[key])
    });

    return text;
  }

  private async saveDefaultTemplatesToDatabase(): Promise<void> {
    for (const value in MailType) {
      const template = await this.mailTemplateRepository.findOne({ where: { type: value as MailType } });
      if (!template) {
        const defaultTemplate = DEFAULT_MAIL_TEMPLATES[value];
        const newTemplate = this.mailTemplateRepository.create();
        newTemplate.subject = defaultTemplate.subject;
        newTemplate.type = defaultTemplate.type;
        newTemplate.textTemplate = defaultTemplate.textTemplate;
        newTemplate.htmlTemplate = defaultTemplate.htmlTemplate;

        await this.mailTemplateRepository.save(newTemplate);
      }
    }
  }

}
