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
import { Observable } from 'rxjs';

@Component({
  selector: 'sui-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent<T> implements AfterViewInit {

  private modalContext = new ModalContext<T>();

  @ViewChild('modal') private modal?: ElementRef<HTMLDivElement>;

  @Input() public component?: Type<unknown>;


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
          useValue: this.modalContext
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

  public onClose$(): Observable<T> {
    return this.modalContext.onClose$();
  }
}
