import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prySortData'
})
export class PrySortDataPipe<T> implements PipeTransform {
  transform(list: T[] | null, property: keyof T | null, direction: 'asc' | 'desc'): T[] {
    if (list) {
      const data = list.slice();
      if (!property) {
        return data;
      }

      const isAsc = direction === 'asc';
      return data.sort((a, b) => {
        const valA = a[property];
        const valB = b[property];
        if (valA !== null && (valB === undefined || valB === null)) {
          return -1;
        }
        if (valB !== null && (valA === undefined || valA === null)) {
          return 1;
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return valA === valB ? 0 : this.compareNumber(valA, valB, isAsc);
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          return valA === valB ? 0 : this.compareString(valA, valB, isAsc);
        } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
          return valA === valB ? 0 : this.compareBoolean(valA, valB, isAsc);
        } else {
          return 0;
        }
      });
    }
    return list ?? [];
  }

  private compareString(a: string, b: string, isAsc: boolean) {
    return a.localeCompare(b) * (isAsc ? 1 : -1);
  }

  private compareNumber(a: number, b: number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private compareBoolean(a: boolean, b: boolean, isAsc: boolean) {
    return (a && !b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
