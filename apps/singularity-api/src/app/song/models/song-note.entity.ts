import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Song } from './song.entity';
import { SongNoteType } from '@singularity/api-interfaces';

@Entity()
export class SongNote {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'enum', enum: SongNoteType })
  public type!: SongNoteType;

  @Column('integer')
  public startBeat!: number;

  @Column('integer')
  public lengthInBeats!: number;

  @Column('integer')
  public pitch!: number;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public text!: string;

  @ManyToOne(() => Song, { onDelete: 'CASCADE' })
  public song!: Song;
}
