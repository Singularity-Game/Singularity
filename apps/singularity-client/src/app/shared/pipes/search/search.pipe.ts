import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<T>(values: T[], searchKeys: string, searchTerm: string): T[] {
    if(values === null) {
      return [];
    }

    const keys = searchKeys.split(',') as (keyof T)[];

    return values.filter((value: T) => keys.some((key: keyof T) => (value[key] as string).toLowerCase().includes(searchTerm.toLowerCase())))
  }
}
