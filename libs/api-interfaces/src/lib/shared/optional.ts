import { Nullable } from './nullable';

export class Optional<T> {
  public readonly value: Nullable<T>;

  constructor(value: Nullable<T>) {
    this.value = value;
  }

  public hasValue(): boolean {
    return this.value !== null;
  }
}
