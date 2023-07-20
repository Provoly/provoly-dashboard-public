import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { PryI18nService, ValueType } from '@provoly/dashboard';

@Pipe({ name: 'formatNumber' })
export class FormatNumberPipe implements PipeTransform {
  constructor(
    private decimalPipe: DecimalPipe,
    private i18nService: PryI18nService
  ) {}

  transform(toDisplay?: ValueType | ValueType[] | null, ...args: any[]): any {
    const result = { isNumber: false, text: `${!toDisplay ? '' : toDisplay}` };
    if (typeof toDisplay === 'number') {
      result.isNumber = true;
      result.text =
        this.decimalPipe
          .transform(toDisplay, '1.0-0')
          ?.replace(/,/g, this.i18nService.instant('@pry.format.thousands'))
          ?.replace(/\./g, this.i18nService.instant('@pry.format.decimal')) || `${toDisplay}`;
    }
    return result;
  }
}
