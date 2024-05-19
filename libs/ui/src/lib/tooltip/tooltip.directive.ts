import {
  ApplicationRef,
  ComponentRef,
  Directive,
  ElementRef, EmbeddedViewRef,
  HostListener,
  Injector,
  Input, OnDestroy, OnInit, TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[suiTooltip]'
})
export class TooltipDirective {
  @Input() suiTooltip?: TemplateRef<unknown>;

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.createTooltipComponent();
    this.setTooltipComponentProperties();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.endTooltip();
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    this.setTooltipPosition(event.clientX);
  }

  private componentRef: Nullable<ComponentRef<TooltipComponent>> = null;

  constructor(
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) { }

  private createTooltipComponent(): void {
    if (this.componentRef !== null) {
      this.componentRef.instance.ngAfterViewInit();
      return;
    }

    this.componentRef = this.viewContainerRef.createComponent(TooltipComponent, {
      injector: this.injector
    });
  }

  private setTooltipComponentProperties(): void {
    if(!this.componentRef) {
      return;
    }

    const { left, right, top } = this.elementRef.nativeElement.getBoundingClientRect();

    this.componentRef.instance.tooltip = this.suiTooltip;
    this.componentRef.instance.left = (right - left) / 2 + left;
    this.componentRef.instance.top = top;
  }

  private setTooltipPosition(clientX: number): void {
    if(!this.componentRef) {
      return
    }

    const { left, width } = this.elementRef.nativeElement.getBoundingClientRect();

    const tiltPercentage= (clientX - left) / width;
    const tiltAbsolute = -25 + tiltPercentage * 50;

    this.componentRef.instance.tilt = tiltAbsolute
  }

  private endTooltip(): void {
    if(!this.componentRef) {
      return
    }

    this.componentRef.instance.out();
  }
}
