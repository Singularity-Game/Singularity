import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[suiSlider]'
})
export class SliderDirective implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  public ngAfterViewInit() {
    const nativeElement = this.elementRef.nativeElement;
    nativeElement.style.setProperty('--value', nativeElement.getAttribute('ng-reflect-model'));
    nativeElement.style.setProperty('--min', nativeElement.min ?? 0);
    nativeElement.style.setProperty('--max', nativeElement.max ?? 100);

    nativeElement.addEventListener('input', () => nativeElement.style.setProperty('--value', nativeElement.value));
    nativeElement.addEventListener('change', () => nativeElement.style.setProperty('--value', nativeElement.value));
  }

}
