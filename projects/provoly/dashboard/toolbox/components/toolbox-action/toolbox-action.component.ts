import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardSelectors,
  ManifestDescription,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { map, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'pry-toolbox-action',
  template: ''
})
export class ToolboxActionComponent extends SubscriptionnerDirective {
  @Input() displayLabels = true;
  @Output() closeOptions = new EventEmitter<void>();
  currentManifest$: Observable<ManifestDescription | undefined>;
  currentManifest: ManifestDescription | undefined;
  canModify$: Observable<boolean>;

  constructor(
    protected store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) protected access: PryBaseAccess
  ) {
    super();
    this.currentManifest$ = this.store.select(DashboardSelectors.currentManifest);
    this.canModify$ = this.currentManifest$.pipe(
      switchMap((manifest) => {
        return manifest ? this.access?.canModifyPresentation(manifest) : of(false);
      })
    );
    this.subscriptions.add(
      this.currentManifest$.subscribe((manifest) => {
        this.currentManifest = manifest;
      })
    );
  }

  close(): void {
    this.closeOptions.emit();
  }
}
