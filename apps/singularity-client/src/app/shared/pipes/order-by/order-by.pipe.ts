import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform<T>(values: T[], orderByKey: keyof T, ascending = true): T[] {
    if(values === null) {
      return [];
    }

    if (ascending) {
      return values.sort((a: T, b: T) => a[orderByKey] > b[orderByKey] ? 1 : -1);
    } else {
      return values.sort((a: T, b: T) => a[orderByKey] < b[orderByKey] ? 1 : -1);
    }
  }
}
