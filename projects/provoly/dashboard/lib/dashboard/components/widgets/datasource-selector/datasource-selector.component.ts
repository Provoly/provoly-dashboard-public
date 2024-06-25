import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { DataSource } from '../../../../core/store/data-source/data-source.model';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { SubscriptionnerDirective } from '../../subscriptionner.directive';
import { DatasourceUtils } from '../../../../core/store/data-source/datasource-utils';
import { DataSourceSelectors } from '../../../../core/store/data-source/data-source.selectors';

@Component({
  selector: 'pry-datasource-selector',
  templateUrl: 'datasource-selector.component.html'
})
export class DatasourceSelectorComponent extends SubscriptionnerDirective {
  manifest$ = new BehaviorSubject<WidgetManifest | null>(null);
  selectedDatasources$: Observable<DataSource[]>;

  selectedIds$ = new BehaviorSubject<string[]>([]);

  @Input() showButtons = true;
  @Input() showTitle = true;
  @Input() set manifest(manifest: WidgetManifest | null) {
    this.manifest$.next(manifest);
    this.selectedIds$.next(DatasourceUtils.getDatasourceArray(manifest?.datasource));
  }

  @Output() previousTab = new EventEmitter();
  @Output() nextTab = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() validated = new EventEmitter();
  @Output() itemsChanged = new EventEmitter<string[]>();

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {
    super();

    this.selectedDatasources$ = combineLatest([
      this.store.select(DataSourceSelectors.getDataSourcesSorted),
      this.selectedIds$
    ]).pipe(
      map(([datasources, selectedIds]) =>
        DatasourceUtils.getAllDatasourcesWithUnknowns(datasources, selectedIds).filter((ds) =>
          selectedIds.includes(ds.id)
        )
      )
    );
    this.subscriptions.add(
      this.selectedIds$.subscribe((selectedIds) => {
        this.itemsChanged.emit(selectedIds);
        this.cdr.detectChanges();
      })
    );
  }

  isGeo(item: DataSource) {
    return DatasourceUtils.isGeo(item);
  }

  toggleSelection(id: string) {
    this.selectedIds$.next(
      this.selectedIds$.value.includes(id)
        ? this.selectedIds$.value.filter((i) => i !== id)
        : [...this.selectedIds$.value, id]
    );
    this.cdr.detectChanges();
  }

  updateDatasourceList(ids: string[]) {
    this.selectedIds$.next(ids);
    this.cdr.detectChanges();
  }
}
