import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardSelectors,
  ManifestDescription,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { of } from 'rxjs';

@Component({
  selector: 'pry-toolbox-action',
  template: ''
})
export class ToolboxActionComponent extends SubscriptionnerDirective {
  @Input() displayLabels = true;
  @Output() closeOptions = new EventEmitter<void>();
  currentManifest: ManifestDescription | undefined;

  constructor(
    protected store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) protected access: PryBaseAccess
  ) {
    super();
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((manifest) => {
        this.currentManifest = manifest?.current;
      })
    );
  }

  close(): void {
    this.closeOptions.emit();
  }

  canModify$() {
    return this.access && this.currentManifest ? this.access.canModifyPresentation(this.currentManifest) : of(false);
  }
}
