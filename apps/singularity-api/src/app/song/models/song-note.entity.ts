import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Song } from './song.entity';
import { AutoMap } from '@automapper/classes';
import { SongNoteType } from '@singularity/api-interfaces';

@Entity()
export class SongNote {
  @PrimaryGeneratedColumn()
  @AutoMap()
  public id: number;

  @Column({ type: 'enum', enum: SongNoteType })
  @AutoMap()
  public type: SongNoteType;

  @Column('integer')
  @AutoMap()
  public startBeat: number;

  @Column('integer')
  @AutoMap()
  public lengthInBeats: number;

  @Column('integer')
  @AutoMap()
  public pitch: number;

  @Column({
    type: 'varchar',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
  })
  @AutoMap()
  public text: string;

  @ManyToOne(() => Song, { onDelete: 'CASCADE' })
  public song: Song;
}
