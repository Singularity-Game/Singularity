import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  HostListener,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './select-option.component';

@Component({
  selector: 'sui-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit {

  public expanded = false;
  public delayedExpanded = false;
  public disabled = false;

  private value: unknown;

  private onChange?: (value: unknown) => void;
  private onTouched?: () => void;

  @ViewChild('text') private textElement?: ElementRef<HTMLSpanElement>;
  @ContentChildren(SelectOptionComponent) selectOptions?: QueryList<SelectOptionComponent>;

  @HostListener('document:click', ['$event'])
  public clickOut(event: PointerEvent): void {
    if (this.elementRef.nativeElement.contains(event.target)) {
      return;
    }

    if (this.expanded) {
      this.toggleExpand();
    }
  }

  constructor(private readonly elementRef: ElementRef,
              private readonly renderer: Renderer2) {
  }

  public ngAfterViewInit(): void {
    let selectedOption = this.selectOptions?.first;

    if (this.value) {
      selectedOption = this.selectOptions?.find((item: SelectOptionComponent) => item.value === this.value);
    }

    if (!selectedOption || !selectedOption.content) {
      return;
    }

    this.setValue(selectedOption.value, selectedOption.valueContent ?? selectedOption.content, false);
  }

  public toggleExpand(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      this.delayedExpanded = true;
    } else {
      setTimeout(() => this.delayedExpanded = false, 200);
    }
  }

  public setValue(value: unknown, content?: ElementRef | string, triggerChange = true): void {
    this.value = value;

    if (this.onChange && triggerChange) {
      this.onChange(value);
    }

    if (this.textElement && content instanceof ElementRef) {
      const clone = content.nativeElement.cloneNode(true);

      if (this.textElement.nativeElement.firstChild) {
        this.renderer.removeChild(this.textElement.nativeElement, this.textElement.nativeElement.firstChild);
      }

      this.renderer.appendChild(this.textElement.nativeElement, clone);
    }

    if (this.textElement && typeof content === 'string') {
      const node = this.renderer.createText(content);


      if (this.textElement.nativeElement.firstChild) {
        this.renderer.removeChild(this.textElement.nativeElement, this.textElement.nativeElement.firstChild);
      }

      this.renderer.appendChild(this.textElement.nativeElement, node);
    }
  }

  public writeValue(obj: unknown): void {
    const selectedOption = this.selectOptions?.find((item: SelectOptionComponent) => item.value === obj);

    if (!selectedOption || !selectedOption.content) {
      return;
    }

    this.setValue(selectedOption.value, selectedOption.valueContent ?? selectedOption.content);
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
