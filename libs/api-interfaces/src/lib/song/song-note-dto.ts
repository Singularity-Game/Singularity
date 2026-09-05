import { SongNoteType } from './song-note-type.enum';

export class SongNoteDto {
  public id!: number;
  public type!: SongNoteType;
  public startBeat!: number;
  public lengthInBeats!: number;
  public pitch!: number;
  public text!: string;
}
