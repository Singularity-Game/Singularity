import { SongDto, SongNoteDto, SongNoteType } from '@singularity/api-interfaces';
import { Nullable } from '@singularity/api-interfaces';
import Konva from 'konva';
import { VOCAL_GRID_SETTINGS } from './vocal-grid-settings';

export class UiSongNote {
  private x: number;
  private y: number;
  private width: number;
  private readonly height = VOCAL_GRID_SETTINGS.linePadding * 1.5;
  private type: SongNoteType;
  private konvaObject: Nullable<Konva.Rect>;

  constructor(songNote: SongNoteDto, song: SongDto) {
    this.type = songNote.type;

    const beatsPerSecond = song.bpm * 4 / 60
    const pxPerBeat = VOCAL_GRID_SETTINGS.noteSpeedInPxPerSecond / beatsPerSecond;
    this.width = songNote.lengthInBeats * pxPerBeat;

    const noteStartPosition = songNote.startBeat * pxPerBeat;
    const noteOffset = (window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor);
    const songGapOffset = (song.gap / 1000) * VOCAL_GRID_SETTINGS.noteSpeedInPxPerSecond
    this.x = noteStartPosition + noteOffset + songGapOffset;

    const highestNote = song.notes
      .filter((note: SongNoteDto) => note.type !== SongNoteType.LineBreak)
      .reduce((prev: number, curr: SongNoteDto) => curr.pitch > prev ? curr.pitch : prev, -Infinity);
    this.y = (highestNote - songNote.pitch) * VOCAL_GRID_SETTINGS.linePadding * 2 + VOCAL_GRID_SETTINGS.linePadding * 1.5 * 0.25;

    this.konvaObject = this.createKonvaObject();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public getHeight(): number {
    return this.height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getType(): SongNoteType {
    return this.type;
  }

  public setX(x: number): void {
    this.konvaObject?.x(x);

    if (!this.konvaObject?.isVisible() && x <= window.innerWidth) {
      this.konvaObject?.show();
    }

    if (x + this.width < 0) {
      this.konvaObject?.destroy();
    }

    this.x = x;
  }

  public getKonvaObject(): Nullable<Konva.Rect> {
    return this.konvaObject;
  }

  private createKonvaObject(): Nullable<Konva.Rect> {
    if(this.type === SongNoteType.LineBreak) {
      return null;
    }

    const noteRect = new Konva.Rect({
      width: this.width,
      height: this.height,
      fill: this.type === SongNoteType.Golden ? VOCAL_GRID_SETTINGS.goldenNoteColor : VOCAL_GRID_SETTINGS.normalNoteColor,
      x: this.x,
      y: this.y,
      cornerRadius: 10,
      stroke: '#000000',
      strokeWidth: 2
    });

    noteRect.perfectDrawEnabled(false);
    noteRect.shadowEnabled(false);
    noteRect.shadowForStrokeEnabled(false);
    noteRect.hitStrokeWidth(0);
    noteRect.listening(false);
    noteRect.cache();
    noteRect.hide();

    return noteRect;
  }
}
