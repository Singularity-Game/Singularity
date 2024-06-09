import {
  AfterViewInit,
  ApplicationRef,
  Component,
  createComponent,
  ElementRef,
  Injector,
  Input,
  Type,
  ViewChild
} from '@angular/core';
import { ModalContext } from './modal-context';
import { NEVER, Observable } from 'rxjs';

@Component({
  selector: 'sui-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent<ResultType, DataType> implements AfterViewInit {
  @ViewChild('modal') private modal?: ElementRef<HTMLDivElement>;

  @Input() public component?: Type<unknown>;
  @Input() public context?: ModalContext<ResultType, DataType>

  constructor(private readonly appRef: ApplicationRef,
              private readonly injector: Injector) {
  }

  public ngAfterViewInit(): void {
    if(!this.component || !this.modal) {
      return;
    }

    const injector = Injector.create({
      providers: [
        {
          provide: ModalContext,
          useValue: this.context
        }
      ],
      parent: this.injector
    });

    const componentRef = createComponent(this.component, {
      hostElement: this.modal?.nativeElement,
      environmentInjector: this.appRef.injector,
      elementInjector: injector
    });

    this.appRef.attachView(componentRef.hostView);
    componentRef.changeDetectorRef.detectChanges();
  }

  public onClose$(): Observable<ResultType> {
    return this.context?.onClose$() ?? NEVER;
  }
}
