import { Pipe, PipeTransform } from '@angular/core';
import { PryI18nService } from '@provoly/dashboard';

@Pipe({
  name: 'sinceDate'
})
export class PrySinceDatePipe implements PipeTransform {
  private _now?: Date;

  constructor(private translateService: PryI18nService) {}

  transform(value: string, ...args: any[]): string {
    const date = new Date(value);

    if (!!args[0] && args[0].onlyLocale) {
      return date.toLocaleString();
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    const dateNow = this._now ?? new Date();

    if (
      date.getFullYear() === dateNow.getFullYear() &&
      date.getMonth() === dateNow.getMonth() &&
      date.getDate() === dateNow.getDate()
    ) {
      return this.translateService.instant('@pry.toolbox.today', {
        hour: `${date.getHours()}`.padStart(2, '0'),
        min: `${date.getMinutes()}`.padStart(2, '0')
      });
    }

    const dayDiff = this.getDayDiff(date, dateNow);
    const dayDiffAbs = Math.ceil(Math.abs(dayDiff));
    const dayDiffPast = dayDiff > 0;
    if (dayDiffAbs > 30) {
      return date.toLocaleString();
    } else {
      return this.translateService.instant(dayDiffPast ? '@pry.toolbox.since_day' : '@pry.toolbox.from_day', {
        day: dayDiffAbs,
        plural: dayDiffAbs >= 2 ? 's' : ''
      });
    }
  }

  getDayDiff(startDate: Date, endDate: Date): number {
    const msInDay = 24 * 60 * 60 * 1000;
    return (endDate.getTime() - startDate.getTime()) / msInDay;
  }

  useNow(date?: Date) {
    this._now = date;
    return this;
  }
}
