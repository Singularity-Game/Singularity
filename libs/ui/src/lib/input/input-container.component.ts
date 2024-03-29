import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'sui-input-container',
  templateUrl: './input-container.component.html',
  styleUrl: './input-container.component.scss'
})
export class InputContainerComponent {

  @ViewChild('inputContainer') inputContainer?: ElementRef<HTMLDivElement>;

  @Input() public label = '';

  public visible = false;
  public mouseX = 0;
  public mouseY = 0;

  public readonly radius = 100;

  public handleMouseEnter(): void {
    this.visible = true;
  }

  public handleMouseLeave(): void {
    this.visible = false;
  }

  public handleMouseMove(event: MouseEvent): void {
    console.log(this.visible, event);

    if(!this.inputContainer) {
      return;
    }

    const { left, top } = this.inputContainer.nativeElement.getBoundingClientRect();

    this.mouseX = event.clientX - left;
    this.mouseY = event.clientY - top;
  }
}
