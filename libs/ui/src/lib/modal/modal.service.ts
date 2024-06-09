import { ApplicationRef, createComponent, Injectable, Type } from '@angular/core';
import { ModalComponent } from './modal.component';
import { Observable, of, tap } from 'rxjs';
import { Nullable } from '@singularity/api-interfaces';
import { ModalContext } from './modal-context';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private readonly applicationRef: ApplicationRef,
              private readonly router: Router) { }

  public open$<ResultType, DataType = null>(component: Type<unknown>, data: DataType): Observable<Nullable<ResultType>> {
    const hostElement = document.getElementById('modal-outlet');
    const newElement = document.createElement('sui-modal');

    if(!hostElement || !hostElement.parentNode) {
      return of(null);
    }

    hostElement.parentNode.insertBefore(newElement, hostElement.nextSibling);

    const componentRef = createComponent(ModalComponent<ResultType, DataType>, {
      hostElement: newElement,
      environmentInjector: this.applicationRef.injector,
    });

    componentRef.instance.context = new ModalContext<ResultType, DataType>(data, componentRef);
    componentRef.instance.component = component;

    this.applicationRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();

    return componentRef.instance.onClose$();
  }
}
