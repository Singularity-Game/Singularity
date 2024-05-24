import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'sui-input-file',
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFileComponent),
      multi: true
    }
  ]
})
export class InputFileComponent implements ControlValueAccessor {

  @Input() public accept = '';

  public disabled = false;

  public onChange?: (value: File) => void;
  public onTouched?: () => void;

  public changeFile(event: any) {
    if(!this.onChange) {
      return;
    }

    this.onChange(event?.target?.files[0]);
  }

  public writeValue(file: File): void {
    // do nothing
  }

  public registerOnChange(fn: (value: File) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
