import Konva from 'konva';
import { VOCAL_GRID_SETTINGS } from './vocal-grid-settings';

export class UiNoteLine {
  private y: number;
  private noteName: string;
  private noteLineColor: string;
  private noteLineDash: number[];
  private konvaObject: Konva.Group;

  constructor(index: number, noteName: string) {
    this.noteName = noteName;
    this.y = index * VOCAL_GRID_SETTINGS.linePadding * 2 + VOCAL_GRID_SETTINGS.linePadding;
    this.noteLineColor = this.getNoteLineColor(noteName);
    this.noteLineDash = this.getNoteLineDash(noteName);
    this.konvaObject = this.createKonvaObject();
  }

  public getKonvaObject(): Konva.Group {
    return this.konvaObject;
  }

  private createKonvaObject(): Konva.Group {

    const text = new Konva.Text({
      text: this.noteName,
      x: window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor + VOCAL_GRID_SETTINGS.lineStrokeWidth * 2,
      y: this.y - VOCAL_GRID_SETTINGS.textFontSize / 2 + 1,
      fill: this.noteLineColor,
      fontFamily: VOCAL_GRID_SETTINGS.textFontFamily,
      fontSize: VOCAL_GRID_SETTINGS.textFontSize,
    });

    const lineLeft = new Konva.Line({
      points: [
        0, this.y, window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor, this.y
      ],
      stroke: this.noteLineColor,
      strokeWidth: VOCAL_GRID_SETTINGS.lineStrokeWidth,
      dash: this.noteLineDash
    });

    const lineRight = new Konva.Line({
      points: [
        window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor + (text?.width() ?? 0) + VOCAL_GRID_SETTINGS.lineStrokeWidth * 4, this.y, window.innerWidth, this.y
      ],
      stroke: this.noteLineColor,
      strokeWidth: VOCAL_GRID_SETTINGS.lineStrokeWidth,
      dash: this.noteLineDash
    });

    const lineCheckpoint = new Konva.Line({
      points: [
        window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor,
        this.y - VOCAL_GRID_SETTINGS.linePadding,
        window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor,
        this.y + VOCAL_GRID_SETTINGS.linePadding
      ],
      stroke: this.noteLineColor,
      strokeWidth: VOCAL_GRID_SETTINGS.lineStrokeWidth,
    });

    const group = new Konva.Group();
    group.add(lineLeft, lineRight, lineCheckpoint, text);

    return group;
  }

  private getNoteLineColor(note: string): string {
    switch (note) {
      case 'F':
        return VOCAL_GRID_SETTINGS.lineFColor;
      case 'C':
        return VOCAL_GRID_SETTINGS.lineCColor;
      default:
        return VOCAL_GRID_SETTINGS.lineDefaultColor;
    }
  }

  private getNoteLineDash(note: string): number[] {
    if (note.endsWith('#')) {
      return VOCAL_GRID_SETTINGS.lineSharpDash;
    } else {
      return VOCAL_GRID_SETTINGS.lineNormalDash;
    }
  }
}
