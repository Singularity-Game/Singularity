import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'sui-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  @Input() size: 's' | 'l' = 'l';

  public expanded = false;
  public delayedExpanded = false;

  @HostListener('document:click', ['$event'])
  public clickOut(event: PointerEvent): void {
    if (this.elementRef.nativeElement.contains(event.target)) {
      return;
    }

    if(this.expanded) {
      this.toggleExpand();
    }
  }

  constructor(private readonly elementRef: ElementRef) {
  }

  public toggleExpand(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.delayedExpanded = true;
    } else {
      setTimeout(() => this.delayedExpanded = false, 200);
    }
  }
}
