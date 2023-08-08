import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { DashboardSelectors, ManifestDescription, PryI18nService } from '@provoly/dashboard';

@Component({
  selector: 'pry-title-presentation',
  templateUrl: './title-presentation.component.html'
})
export class PryTitlePresentationComponent {
  presentation$: Observable<ManifestDescription | null>;
  presentationTitle$: Observable<string | null>;

  constructor(private store: Store, private i18nService: PryI18nService) {
    this.presentation$ = this.store.select(DashboardSelectors.presentation).pipe(
      map((presentation) => {
        if (presentation.current) {
          return presentation.current;
        }
        return null;
      })
    );

    this.presentationTitle$ = this.presentation$.pipe(
      map((presentation) => {
        if (presentation) {
          return presentation.name;
        }
        return this.i18nService.instant('@pry.header.noCurrentPresentation');
      })
    );
  }
}
