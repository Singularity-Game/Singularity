import { Pipe, PipeTransform } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform<T>(values: Nullable<T[]>, orderByKey: keyof T, ascending: boolean = true): Nullable<T[]> {
    if(values === null) {
      return null;
    }

    if (ascending) {
      return values.sort((a: T, b: T) => a[orderByKey] > b[orderByKey] ? 1 : -1);
    } else {
      return values.sort((a: T, b: T) => a[orderByKey] < b[orderByKey] ? 1 : -1);
    }
  }
}
