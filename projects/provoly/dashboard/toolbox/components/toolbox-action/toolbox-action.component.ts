import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '@provoly/dashboard';

@Component({
  selector: 'pry-toolbox-action',
  template: ''
})
export class ToolboxActionComponent extends SubscriptionnerDirective {
  @Input() displayLabels = true;
  @Output() closeOptions = new EventEmitter<void>();

  constructor(protected store: Store) {
    super();
  }

  close(): void {
    this.closeOptions.emit();
  }
}
