import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pryFilter'
})
export class PryFilterPipe<T> implements PipeTransform {
  transform(items: T[], property: keyof T, filter: string): any {
    return items.filter((item) => String(item[property]).indexOf(filter) !== -1);
  }
}
