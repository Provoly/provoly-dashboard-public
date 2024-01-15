import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { UNKNOWN_DATASOURCE } from '../../../../core/components/translate-id/translate-id.pipe';
import { NamedQuery } from '../../../../core/store/data-source/data-source.model';
import { DataSourceSelectors } from '../../../../core/store/data-source/data-source.selectors';
import { ChipsSelectorComponent } from '../../../../core/components/chips-selector/chips-selector.component';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';
import { PryI18nService } from '../../../../core/i18n/i18n.service';

@Component({
  selector: 'pry-datasource-selector',
  templateUrl: '../../../../core/components/chips-selector/chips-selector.component.html'
})
export class DatasourceSelectorComponent extends ChipsSelectorComponent implements SubscriptionnerDirective {
  _usedItems$ = new BehaviorSubject([] as any[]);
  usedDatasources$: Observable<NamedQuery[]>;

  @Input() override set usedItems(items: any[]) {
    this._usedItems$.next(items);
  }

  @Input() set manifest(manifest: WidgetManifest | null) {
    this.manifest$.next(manifest);
  }

  manifest$ = new BehaviorSubject<WidgetManifest | null>(null);

  constructor(private store: Store, cdr: ChangeDetectorRef, i18n: PryI18nService) {
    super(cdr, i18n);
    this.subscriptions.add(
      combineLatest([this.manifest$, this.store.select(DataSourceSelectors.getDataSourcesSorted)])
        .pipe(
          map(([manifest, allNamedQueries]) => {
            let dss = [...allNamedQueries];
            if (!!manifest) {
              const manifestNamedQueries = Array.isArray(manifest.datasource)
                ? manifest.datasource
                : [manifest.datasource];
              manifestNamedQueries.forEach((manifestNamedQuery) => {
                const alreadyPresent = !!allNamedQueries.find((nq) => nq.id === manifestNamedQuery);
                if (!alreadyPresent) {
                  dss.push(UNKNOWN_DATASOURCE(manifestNamedQuery ?? ''));
                }
              });
            }
            return dss;
          })
        )
        .subscribe((datasources) => {
          this.items$.next(datasources);
        })
    );

    this.usedDatasources$ = combineLatest([
      this._usedItems$,
      this.store.select(DataSourceSelectors.getDataSources)
    ]).pipe(
      map(
        ([usedDatasources, datasources]) =>
          usedDatasources
            .map((usedDatasource) => datasources.find((ds) => ds.id === usedDatasource.id) ?? usedDatasource)
            .map((nq) => (typeof nq !== 'string' ? nq : UNKNOWN_DATASOURCE(nq))) as NamedQuery[]
      )
    );

    this.subscriptions.add(
      this.usedDatasources$.subscribe((usedDatasources) => {
        this.usedItems$.next(usedDatasources);
      })
    );
  }
}
