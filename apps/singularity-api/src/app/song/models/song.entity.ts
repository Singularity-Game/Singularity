import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SongNote } from './song-note.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public name!: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public artist!: string;

  @Column('integer')
  public year!: number;

  @Column('double')
  public bpm!: number;

  @Column('integer')
  public gap!: number;

  @Column('double')
  public start!: number;

  @Column('double')
  public end!: number;

  @Column('double')
  public pointsPerBeat!: number;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public audioFileName!: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public videoFileName!: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public coverFileName!: string;

  @OneToMany(() => SongNote, songNote => songNote.song, { onDelete: 'CASCADE', cascade: true })
  public notes!: SongNote[];
}
