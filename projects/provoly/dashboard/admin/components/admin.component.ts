import { Component } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '@provoly/dashboard';
import { AdminActions } from '../store/admin.actions';
import { AdminState } from '../store/admin.reducer';

@Component({
  selector: 'pry-admin',
  templateUrl: './admin.component.html'
})
export class PryAdminComponent extends SubscriptionnerDirective {
  limit?: string;

  constructor(private store: Store<AdminState>, private route: ActivatedRoute) {
    super();
    this.store.dispatch(AdminActions.resetActions());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.subscriptions.add(this.route.data.subscribe((data) => (this.limit = data['limitMenu'])));
  }
}

export function noWhitespaceValidator(control: AbstractControl) {
  const isWhitespace = (control.value || '').trim().length < 3 && /\s/.test(control.value);
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
