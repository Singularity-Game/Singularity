import { AutoMap } from '@automapper/classes';
import { SongNoteType } from './song-note-type.enum';

export class SongNoteDto {
  @AutoMap()
  public id!: number;

  @AutoMap()
  public type!: SongNoteType;

  @AutoMap()
  public startBeat!: number;

  @AutoMap()
  public lengthInBeats!: number;

  @AutoMap()
  public pitch!: number;

  @AutoMap()
  public text!: string;
}
