import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sui-input-number',
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent implements ControlValueAccessor {
  public value = 0;
  public disabled = false;

  private onChange?: (value: number) => void;
  private onTouched?: () => void;

  public increment(): void {
    this.setValue(this.value + 1);
  }

  public decrement(): void {
    this.setValue(this.value - 1);
  }

  public setValue(value: number): void {
    this.value = value;
    if(this.onChange) {
      this.onChange(this.value);
    }
  }

  // Control Value Accessor
  public writeValue(obj: number): void {
    this.value = obj;
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
