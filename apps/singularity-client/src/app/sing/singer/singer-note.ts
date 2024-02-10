import { NoteHelper } from '../../shared/helpers/note-helper';
import { Nullable } from '@singularity/api-interfaces';
import { NormalisedSingerNote } from './normalised-singer-note';

export class SingerNote {
  public readonly noteNumberInt: number;
  public readonly noteNumberFloat: number;
  public readonly noteName: string;
  public readonly pitch: number;
  public readonly startNote: Nullable<SingerNote>;
  private baseDifference?: number;

  constructor(pitch: number, startNote: Nullable<SingerNote>) {
    this.noteNumberInt = NoteHelper.getNoteNumber(pitch);
    this.noteNumberFloat = NoteHelper.getNoteNumberFloat(pitch)
    this.noteName = NoteHelper.getNote(this.noteNumberInt);
    this.pitch = pitch;
    this.startNote = startNote;
  }

  private getBaseDifference(expectedNoteNumber: number): number {
    if(!this.baseDifference) {
      this.baseDifference = expectedNoteNumber - this.noteNumberFloat;
    }

    return this.baseDifference;
  }

  public normalize(expectedNoteNumber: number): NormalisedSingerNote {
    let difference: number;
    if (this.startNote) {
      difference = this.startNote.getBaseDifference(expectedNoteNumber);
    } else {
      difference = expectedNoteNumber - this.noteNumberFloat;
    }

    const octaveDifference = Math.round(difference / 12);
    const normalisedNoteNumberFloat = this.noteNumberFloat + octaveDifference * 12;

    return new NormalisedSingerNote(normalisedNoteNumberFloat);
  }
}
