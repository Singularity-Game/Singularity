import { Nullable } from '@singularity/api-interfaces';
import Konva from 'konva';
import { UiVocal } from './ui-vocal';
import { VOCAL_GRID_SETTINGS } from './vocal-grid-settings';
import { NormalisedSingerNote } from '../../../singer/normalised-singer-note';

export class UiVocalTrack {
  private vocals: UiVocal[] = [];
  private group = new Konva.Group();
  private readonly highestNote: number;
  private readonly color: string;
  private readonly microphoneLatency: number;

  constructor(highestNote: number, color: string, microphoneLatency: number) {
    this.highestNote = highestNote;
    this.color = color;
    this.microphoneLatency = microphoneLatency;
    this.addNewVocal();
  }

  public addNote(note: Nullable<NormalisedSingerNote>): void {
    const lastVocal = this.vocals[this.vocals.length - 1];

    if(note === null) {
      if (!lastVocal.isEmpty()) {
        this.addNewVocal();
      }
      return;
    }

    const y = (this.highestNote - note.noteNumberFloat) * VOCAL_GRID_SETTINGS.linePadding * 2;

    lastVocal.addPoint(y)
  }

  public moveLeft(amount: number): void {
    this.vocals.forEach((vocal: UiVocal) => vocal.moveLeft(amount));
  }

  public getKonvaObject(): Konva.Group {
    return this.group;
  }

  private addNewVocal(): void {
    const vocal = new UiVocal(this.color, this.microphoneLatency);
    this.vocals.push(vocal);
    this.group.add(vocal.getKonvaObject());
  }
}
