import { Pipe, PipeTransform } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';

@Pipe({
  name: 'noComma',
})
export class NoCommaPipe implements PipeTransform {
  transform(val: Nullable<string>): string {
    if (val !== undefined && val !== null) {
      // here we just remove the commas from value
      return val.toString().replace(/,/g, "");
    } else {
      return "";
    }
  }
}
