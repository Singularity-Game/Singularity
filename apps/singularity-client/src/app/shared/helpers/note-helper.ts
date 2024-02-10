import { SongNoteDto } from '@singularity/api-interfaces';

export class NoteHelper {
  public static getNoteNumber(frequency: number): number {
    return Math.floor(NoteHelper.getNoteNumberFloat(frequency));
  }

  public static getNoteNumberFloat(frequency: number): number {
    return 12 * (Math.log(frequency / 440) / Math.log(2)) + 69;
  }

  public static getNote(noteNumber: number): string {
    const notes = [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
    ];

    return notes[((noteNumber % notes.length) + notes.length) % notes.length];
  }


  public static getLastNote(notes: SongNoteDto[]): SongNoteDto {
    return notes.reduce((previous: SongNoteDto, current: SongNoteDto) => current.startBeat > previous.startBeat ? current : previous, notes[0]);
  }

}
