import { Pipe, PipeTransform } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<T>(values: Nullable<T[]>, searchKeys: string, searchTerm: string): Nullable<T[]> {
    if(values === null) {
      return null;
    }

    const keys = searchKeys.split(',') as (keyof T)[];

    return values.filter((value: T) => keys.some((key: keyof T) => (value[key] as string).toLowerCase().includes(searchTerm.toLowerCase())))
  }
}
