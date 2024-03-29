import {
  AfterContentChecked,
  AfterContentInit, AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef, forwardRef,
  HostListener, QueryList,
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

    this.expanded = false;
  }

  constructor(private readonly elementRef: ElementRef,
              private readonly renderer: Renderer2) {
  }

  public ngAfterViewInit(): void {
    const firstOption = this.selectOptions?.first;
    if (!firstOption || !firstOption.content) {
      return;
    }

    this.setValue(firstOption.value, firstOption.content);
  }

  public toggleExpand(): void {
    this.expanded = !this.expanded;
  }

  public setValue(value: unknown, content?: ElementRef): void {
    this.value = value;

    if (this.onChange) {
      this.onChange(value);
    }

    if (this.textElement && content) {
      const clone = content.nativeElement.cloneNode(true);
      if(this.textElement.nativeElement.firstChild) {
        this.renderer.removeChild(this.textElement.nativeElement, this.textElement.nativeElement.firstChild);
      }
      this.renderer.appendChild(this.textElement.nativeElement, clone);
    }
  }

  public writeValue(obj: unknown): void {
    this.value = obj;
  }

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
