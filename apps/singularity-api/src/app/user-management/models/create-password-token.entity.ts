import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { UUID } from '@singularity/api-interfaces';

@Entity()
export class CreatePasswordTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User,{ eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'varchar', unique: true })
  token: string;

  @Column({ type: 'date' })
  validUntil: Date;
}
