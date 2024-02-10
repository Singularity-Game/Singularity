import Konva from "konva";
import { VOCAL_GRID_SETTINGS } from './vocal-grid-settings';

export class UiVocal {
  private line: Konva.Line;
  private group = new Konva.Group();

  private readonly microphoneLatency: number;

  constructor(color: string, microphoneLatency: number) {
    this.line = new Konva.Line({
      stroke: color + 'AA',
      strokeWidth: VOCAL_GRID_SETTINGS.linePadding * 2,
      lineCap: 'round',
      lineJoin: 'round',
      perfectDrawEnabled: true,
      points: [],
      shadowForStrokeEnabled: true,
      shadowColor: '#000000',
      shadowOpacity: 1
    });

    this.microphoneLatency = microphoneLatency;

    this.group.add(this.line);
  }

  public addPoint(y: number): void {
    const microphoneLatencyXOffset = (this.microphoneLatency / 1000) * VOCAL_GRID_SETTINGS.noteSpeedInPxPerSecond;

    this.line.points().push(window.innerWidth / VOCAL_GRID_SETTINGS.lineCheckpointLeftDivisor - microphoneLatencyXOffset, y);
    this.line.show();
  }

  public moveLeft(amount: number): void {
    this.line.points().forEach((value: number, index: number) => {
      // we only want to move the x coordinates, which should be all even indexes
      if (index % 2 !== 0) {
        return;
      }

      this.line.points()[index] = value - amount;
    });

    const isLineOutOfSight = this.line.points().every((point: number, index: number) => index % 2 !== 0 || point < 0);

    if(isLineOutOfSight) {
      this.line.hide();
    }
  }

  public getKonvaObject(): Konva.Group {
    return this.group;
  }

  public isEmpty(): boolean {
    return this.line.points().length === 0;
  }
}
