import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { UNKNOWN_DATASOURCE } from '../../../../core/components/translate-id/translate-id.pipe';
import { GeoMetadata } from '../../../../core/model/dataset.interface';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { Dataset, DataSource, NamedQuery } from '../../../../core/store/data-source/data-source.model';
import { DataSourceSelectors } from '../../../../core/store/data-source/data-source.selectors';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';

@Component({
  selector: 'pry-datasource-selector',
  templateUrl: './datasource-selector.component.html'
})
export class DatasourceSelectorComponent extends SubscriptionnerDirective {
  @Input() set manifest(manifest: WidgetManifest | null) {
    this.manifest$.next(manifest);
  }

  @Input() set datasourceIds(datasourceIds: string[]) {
    this.usedDatasourceIds$.next(datasourceIds);
  }

  @Output() cancel = new EventEmitter();
  @Output() validated = new EventEmitter();
  @Output() previousTab = new EventEmitter();
  @Output() nextTab = new EventEmitter();
  @Output() datasourcesChanged = new EventEmitter<DataSource[]>();

  manifest$ = new BehaviorSubject<WidgetManifest | null>(null);
  usedDatasourceIds$ = new BehaviorSubject<string[]>([]);
  usedDatasources$: Observable<DataSource[]>;
  allDataSources$: Observable<DataSource[]>;
  unusedDatasources$: Observable<any>;
  search$ = new BehaviorSubject('');
  idToNameDatasource: { [id: string]: string | undefined } = {};

  constructor(private store: Store, private cdr: ChangeDetectorRef) {
    super();
    this.allDataSources$ = combineLatest([
      this.manifest$,
      this.store.select(DataSourceSelectors.getDataSourcesSorted)
    ]).pipe(
      map(([manifest, allNamedQueries]) => {
        let dss = [...allNamedQueries];
        if (!!manifest) {
          const manifestNamedQueries = Array.isArray(manifest.datasource) ? manifest.datasource : [manifest.datasource];
          manifestNamedQueries.forEach((manifestNamedQuery) => {
            const alreadyPresent = !!allNamedQueries.find((nq) => nq.id === manifestNamedQuery);
            if (!alreadyPresent) {
              dss.push(UNKNOWN_DATASOURCE(manifestNamedQuery ?? ''));
            }
          });
        }
        return dss;
      })
    );
    this.subscriptions.add(
      this.allDataSources$.subscribe((allDs) => allDs.forEach((ds) => (this.idToNameDatasource[ds.id] = ds.name)))
    );
    this.usedDatasources$ = combineLatest([
      this.usedDatasourceIds$,
      this.store.select(DataSourceSelectors.getDataSources)
    ]).pipe(
      map(
        ([ids, datasources]) =>
          ids
            .map((id) => datasources.find((ds) => ds.id === id) ?? id)
            .map((nq) => (typeof nq !== 'string' ? nq : UNKNOWN_DATASOURCE(nq))) as NamedQuery[]
      )
    );
    this.usedDatasources$.subscribe((datasources) => this.datasourcesChanged.emit(datasources));
    this.unusedDatasources$ = combineLatest([this.allDataSources$, this.usedDatasourceIds$, this.search$]).pipe(
      map(([allDss, usedDsIds, search]) =>
        allDss.filter((ds) => !usedDsIds.includes(ds.id) && ds.name.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }

  toogleDataSource(id: string) {
    if (!this.usedDatasourceIds$.getValue().includes(id)) {
      this.usedDatasourceIds$.next([...this.usedDatasourceIds$.getValue(), id]);
    } else {
      this.usedDatasourceIds$.next(this.usedDatasourceIds$.getValue().filter((dsId) => dsId !== id));
    }
    this.cdr.detectChanges();
  }

  isGeo(ds: NamedQuery | Dataset) {
    return ds.metadata?.find((m) => m.metadataDef.name === GeoMetadata.NAMESPACE) !== undefined;
  }

  search($event: any) {
    this.search$.next($event);
    this.cdr.detectChanges();
  }
}
