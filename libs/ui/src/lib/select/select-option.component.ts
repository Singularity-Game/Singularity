import { Component, ContentChild, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { SelectComponent } from './select.component';
import { ButtonComponent } from '../button/button.component';
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'sui-select-option',
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.scss'
})
export class SelectOptionComponent implements OnDestroy {
  @Input() public value: unknown;
  @Input() public valueContent: Nullable<string> = null;

  @ViewChild('content') public content?: ElementRef<HTMLSpanElement>;

  constructor(private selectComponent: SelectComponent) {
  }

  public select(): void {
    this.selectComponent.toggleExpand();
    this.selectComponent.setValue(this.value, this.valueContent ?? this.content);
  }

  public ngOnDestroy(): void {
    console.log('test');
  }
}
