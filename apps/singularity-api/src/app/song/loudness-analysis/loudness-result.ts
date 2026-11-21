export class LoudnessResult {
  public readonly lufs: number;
  public readonly peakDb: number;

  constructor(lufs: number, peakDb: number) {
    this.lufs = lufs;
    this.peakDb = peakDb;
  }
}
