import { finalize, Observable, Subject, take } from 'rxjs';
import { Nullable } from '@singularity/api-interfaces';
import { ComponentRef } from '@angular/core';
import { ModalComponent } from './modal.component';

export class ModalContext<ResultType, DataType> {

  public readonly data: DataType;
  private readonly closeSubject = new Subject<ResultType>();
  private readonly componentRef: ComponentRef<ModalComponent<ResultType, DataType>>;

  constructor(data: DataType, compoentRef: ComponentRef<ModalComponent<ResultType, DataType>>) {
    this.data = data;
    this.componentRef = compoentRef;
  }

  public close(result: ResultType): void {
    this.closeSubject.next(result);
    this.componentRef.destroy();
  }

  public onClose$(): Observable<ResultType> {
    return this.closeSubject.asObservable()
      .pipe(
        take(1),
        finalize(() => this.componentRef.destroy())
      );
  }
}
