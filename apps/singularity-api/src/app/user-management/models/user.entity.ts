import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  username!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  profilePictureBase64!: string;

  @Column({ type: 'varchar', nullable: true })
  hashedPassword!: string;

  @Column({ type: 'boolean', nullable: false })
  active!: boolean;

  @Column({ type: 'boolean', nullable: false })
  isAdmin!: boolean;
}
