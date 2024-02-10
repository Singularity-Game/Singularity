import { Nullable } from "@singularity/api-interfaces";

export class LoadProgress<T> {
  public readonly progress: number;
  public readonly resultReady: boolean;
  public readonly result: Nullable<T>;

  constructor(progress: number, result?: Nullable<T>) {
    this.progress = progress;
    if (result) {
      this.resultReady = true;
      this.result = result;
    } else {
      this.result = null;
      this.resultReady = false;
    }
  }
}
