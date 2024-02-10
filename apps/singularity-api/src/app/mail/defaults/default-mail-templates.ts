import { MailType } from '../types/mail-type';
import { MailTemplate } from '../entities/mail-template.entity';

export const DEFAULT_MAIL_TEMPLATES: Record<MailType, MailTemplate> = {
  [MailType.CreatePassword]: new MailTemplate(
    MailType.CreatePassword,
    'Bitte vergebe ein Passwort.',
    'Hallo {{username}}\nDu wurdest zu Singularity eingeladen.\nBitte vergebe ein Passwort, indem du auf den folgenden Link klickst:\n\n{{url}}'
  ),
  [MailType.ResetPassword]: new MailTemplate(
    MailType.ResetPassword,
    'Passwort zurücksetzen',
    'Hallo {{username}}\nDu möchtest dein Passwort zurücksetzen.\nBitte vergebe ein Passwort, indem du auf den folgenden Link klickst:\n\n{{url}}'
  )
}
