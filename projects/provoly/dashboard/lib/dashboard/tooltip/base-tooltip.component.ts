import { Component, ElementRef, HostBinding } from '@angular/core';
import { ResultSet } from '../../core/model/result-set.interface';
import { SubscriptionnerDirective } from '../components/subscriptionner.directive';

@Component({ selector: 'pry-tooltip-widget', template: '' })
export class BaseTooltipComponent extends SubscriptionnerDirective {
  @HostBinding('class') class = 'm-tooltip__item';

  data: {
    item?: any;
    resultSet?: ResultSet;
  } = {};
  context: any;
  popup?: ElementRef;
}
