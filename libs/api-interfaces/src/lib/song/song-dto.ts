import { SongNoteDto } from './song-note-dto';

export class SongDto {
  public id!: number;
  public name!: string;
  public artist!: string;
  public year!: number;
  public bpm!: number;
  public gap!: number;
  public start!: number;
  public end!: number;
  public pointsPerBeat!: number;
  public notes!: SongNoteDto[];
}
