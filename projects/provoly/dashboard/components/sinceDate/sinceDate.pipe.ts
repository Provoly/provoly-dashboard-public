import { Pipe, PipeTransform } from '@angular/core';
import { PryI18nService } from '@provoly/dashboard';

@Pipe({
  name: 'sinceDate'
})
export class PrySinceDatePipe implements PipeTransform {
  constructor(private translateService: PryI18nService) {}

  transform(value: string): string {
    const date = new Date(value);
    const dateNow = new Date();
    const dayDif = this.getDayDiff(date, dateNow);
    if (dayDif <= 0) {
      return this.translateService.instant('@pry.toolbox.now');
    } else if (dayDif > 0 && dayDif <= 30) {
      return this.translateService.instant('@pry.toolbox.since_day', { day: dayDif });
    } else if (dayDif > 30) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
      return `${day}/${month}/${date.getFullYear()}`;
    } else {
      return '';
    }
  }

  getDayDiff(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;

    return Math.floor((Number(endDate) - Number(startDate)) / msInDay);
  }
}
