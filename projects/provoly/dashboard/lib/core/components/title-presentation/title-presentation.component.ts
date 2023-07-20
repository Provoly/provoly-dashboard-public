import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { PryI18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'pry-title-presentation',
  templateUrl: './title-presentation.component.html'
})
export class PryTitlePresentationComponent {
  presentationTitle$: Observable<string>;

  constructor(
    private store: Store,
    private i18nService: PryI18nService
  ) {
    this.presentationTitle$ = combineLatest([this.store.select(DashboardSelectors.presentation)]).pipe(
      map(([presentation]) => {
        if (presentation.current) {
          return presentation.current.name;
        }
        return this.i18nService.instant('@pry.header.noCurrentPresentation');
      })
    );
  }
}
