import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MailType } from "../types/mail-type";

@Entity()
export class MailTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MailType, unique: true, nullable: false })
  type: MailType

  @Column({ type: 'varchar', nullable: false })
  subject: string;

  @Column({ type: 'varchar', nullable: false })
  textTemplate: string;

  @Column({ type: 'varchar', nullable: true })
  htmlTemplate: string;

  constructor(type?: MailType, subject?: string, textTemplate?: string, htmlTemplate?: string) {
    this.type = type;
    this.subject = subject;
    this.textTemplate = textTemplate;
    this.htmlTemplate = htmlTemplate;
  }
}
