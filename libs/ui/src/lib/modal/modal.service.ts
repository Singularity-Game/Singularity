import { ApplicationRef, createComponent, Injectable, Type } from '@angular/core';
import { ModalComponent } from './modal.component';
import { Observable, of, tap } from 'rxjs';
import { Nullable } from '@singularity/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private readonly applicationRef: ApplicationRef) { }

  public open$<T>(component: Type<unknown>): Observable<Nullable<T>> {
    const hostElement = document.getElementById('modal-outlet');
    const newElement = document.createElement('sui-modal');

    if(!hostElement || !hostElement.parentNode) {
      return of(null);
    }

    hostElement.parentNode.insertBefore(newElement, hostElement.nextSibling);

    const componentRef = createComponent(ModalComponent<T>, {
      hostElement: newElement,
      environmentInjector: this.applicationRef.injector,
    });

    componentRef.instance.component = component;

    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();

    return componentRef.instance.onClose$()
      .pipe(
        tap(() => componentRef.destroy())
      );
  }
}
