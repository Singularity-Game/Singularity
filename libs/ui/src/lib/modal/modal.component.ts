import { Component, Injector, Input, OnInit, Type } from '@angular/core';
import { ModalContext } from './modal-context';
import { NEVER, Observable } from 'rxjs';

@Component({
  selector: 'sui-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent<ResultType, DataType> implements OnInit {
  @Input() public component?: Type<unknown>;
  @Input() public context?: ModalContext<ResultType, DataType>;

  public componentInjector?: Injector;

  constructor(private readonly injector: Injector) {
  }

  public ngOnInit(): void {
    this.componentInjector = Injector.create({
      providers: [
        {
          provide: ModalContext,
          useValue: this.context
        }
      ],
      parent: this.injector
    });
  }

  public onClose$(): Observable<ResultType> {
    return this.context?.onClose$() ?? NEVER;
  }
}
