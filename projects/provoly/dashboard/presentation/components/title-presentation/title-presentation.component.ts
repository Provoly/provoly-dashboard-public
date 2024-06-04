import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DashboardSelectors, ManifestDescription } from '@provoly/dashboard';

@Component({
  selector: 'pry-title-presentation',
  templateUrl: './title-presentation.component.html'
})
export class PryTitlePresentationComponent {
  currentPresentation$: Observable<ManifestDescription | undefined>;

  constructor(private store: Store) {
    this.currentPresentation$ = this.store.select(DashboardSelectors.currentManifest);
  }
}
