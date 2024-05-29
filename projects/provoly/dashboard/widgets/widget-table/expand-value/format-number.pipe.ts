import { Pipe, PipeTransform } from '@angular/core';
import { PryI18nService, ValueType } from '@provoly/dashboard';

@Pipe({ name: 'formatNumber' })
export class FormatNumberPipe implements PipeTransform {
  constructor(private i18nService: PryI18nService) {}

  // @TODO remove/rework this pipe later when field formatting is implemented

  transform(toDisplay?: ValueType | ValueType[] | null, ...args: any[]): any {
    const result = { isNumber: false, text: `${!toDisplay ? '' : toDisplay}` };
    if (typeof toDisplay === 'number') {
      result.isNumber = true;
      result.text = new Intl.NumberFormat().format(toDisplay);
    }
    return result;
  }
}
