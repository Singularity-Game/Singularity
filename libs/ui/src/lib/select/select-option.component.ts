import { Component, ContentChild, ElementRef, Input, ViewChild } from '@angular/core';
import { SelectComponent } from './select.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'sui-select-option',
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.scss'
})
export class SelectOptionComponent {
  @Input() public value: unknown;

  @ViewChild('content') public content?: ElementRef<HTMLSpanElement>;

  constructor(private selectComponent: SelectComponent) {
  }

  public select(): void {
    this.selectComponent.toggleExpand();
    this.selectComponent.setValue(this.value, this.content);
  }
}
