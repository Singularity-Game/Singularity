import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { UUID } from '@singularity/api-interfaces';

@Entity()
export class User {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ type: 'varchar', nullable: false, unique: true })
  username: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @AutoMap()
  @Column({ type: 'varchar', nullable: true })
  profilePictureBase64: string;

  @Column({ type: 'varchar', nullable: true })
  hashedPassword: string;

  @AutoMap()
  @Column({ type: 'boolean', nullable: false })
  active: boolean;

  @AutoMap()
  @Column({ type: 'boolean', nullable: false })
  isAdmin: boolean;
}
