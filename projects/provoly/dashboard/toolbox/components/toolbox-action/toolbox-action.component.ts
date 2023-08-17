import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '@provoly/dashboard';

@Component({
  selector: 'pry-toolbox-action',
  template: ''
})
export class ToolboxActionComponent extends SubscriptionnerDirective {
  @Input() displayLabels = true;

  constructor(protected store: Store) {
    super();
  }
}
