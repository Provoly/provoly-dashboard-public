import { Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive()
export class SubscriptionnerDirective implements OnDestroy {
  subscriptions: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
