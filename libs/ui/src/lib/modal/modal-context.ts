import { Observable, Subject, take } from 'rxjs';

export class ModalContext<T> {

  private readonly closeSubject = new Subject<T>();

  public close(result: T): void {
    this.closeSubject.next(result);
  }

  public onClose$(): Observable<T> {
    return this.closeSubject.asObservable().pipe(take(1));
  }
}
