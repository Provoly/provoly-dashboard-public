import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRangeHighlight'
})
export class DateRangeHighlightPipe implements PipeTransform {
  transform(day: number, month: number, year: number, start: Date | null, end: Date | null): string {
    let className = '';

    function getDate() {
      return new Date(year, month, day + 1);
    }

    if ((start && !end) || this.areDatesEqual(start, end)) {
      className = this.areDatesEqual(getDate(), start) ? '-selected' : '';
    } else if (start && end) {
      if (this.areDatesEqual(getDate(), start) && !this.areDatesEqual(start, end)) {
        className = '-start';
      } else if (this.areDatesEqual(getDate(), end) && !this.areDatesEqual(start, end)) {
        className = '-end';
      } else if (getDate() > start && getDate() < end) {
        className = '-in-range';
      }
    }
    return className;
  }

  private areDatesEqual(date1: Date | null, date2: Date | null) {
    if (date1 && date2) {
      date1.setHours(0, 0, 0, 0);
      date2.setHours(0, 0, 0, 0);
      return date1.getTime() === date2.getTime();
    }
    return false;
  }
}
