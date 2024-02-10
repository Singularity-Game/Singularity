import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SongNote } from './song-note.entity';
import { AutoMap } from '@automapper/classes';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  @AutoMap()
  public id: number;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  @AutoMap()
  public name: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  @AutoMap()
  public artist: string;

  @Column('integer')
  @AutoMap()
  public year: number;

  @Column('double')
  @AutoMap()
  public bpm: number;

  @Column('integer')
  @AutoMap()
  public gap: number;

  @Column('double')
  @AutoMap()
  public start: number;

  @Column('double')
  @AutoMap()
  public end: number;

  @Column('double')
  @AutoMap()
  public pointsPerBeat: number;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public audioFileName: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public videoFileName: string;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  public coverFileName: string;

  @OneToMany(() => SongNote, songNote => songNote.song, { onDelete: 'CASCADE', cascade: true })
  @AutoMap(() => [SongNote])
  public notes: SongNote[];
}
