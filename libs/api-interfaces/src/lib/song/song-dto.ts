import { AutoMap } from '@automapper/classes';
import { SongNoteDto } from './song-note-dto';

export class SongDto {
  @AutoMap()
  public id!: number;

  @AutoMap()
  public name!: string;

  @AutoMap()
  public artist!: string;

  @AutoMap()
  public year!: number;

  @AutoMap()
  public bpm!: number;

  @AutoMap()
  public gap!: number;

  @AutoMap()
  public start!: number;

  @AutoMap()
  public end!: number;

  @AutoMap()
  public pointsPerBeat!: number;

  @AutoMap(() => [SongNoteDto])
  public notes!: SongNoteDto[];
}
