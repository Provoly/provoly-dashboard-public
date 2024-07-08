import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Dataset, DataSource } from '../../../../../core/store/data-source/data-source.model';
import { DataSourceActions } from '../../../../../core/store/data-source/data-source.actions';
import { DataSourceSelectors } from '../../../../../core/store/data-source/data-source.selectors';
import { Category } from '../../../../../core/store/category/category.interface';
import { DashboardActions } from '../../../../store/dashboard.actions';
import { SubscriptionnerDirective } from '../../../subscriptionner.directive';
import { DatasourceUtils } from '../../../../../core/store/data-source/datasource-utils';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'pry-datasource-list',
  templateUrl: './datasource-list.component.html'
})
export class PryDatasourceListComponent extends SubscriptionnerDirective implements OnInit {
  datasources$: Observable<DataSource[]>;
  datasets$: Observable<Dataset[]>;
  search$ = new BehaviorSubject('');
  categories$: Observable<Category[]>;
  selectedCategories = [];
  selectedCategories$ = new BehaviorSubject<Category[]>([]);
  filteredDatasources$!: Observable<(DataSource & { isSelected?: boolean })[]>;
  selectedDatasources$ = new BehaviorSubject<string[]>([]);
  _mode$ = new BehaviorSubject<string>('list');

  @Input() set mode(mode: 'list' | 'selector') {
    this._mode$.next(mode);
  }
  @Input() set selectedDatasources(datasourceIds: string[]) {
    this.selectedDatasources$.next(datasourceIds);
  }

  @Output() consultedDataset = new EventEmitter<Dataset>();
  @Output() datasourceSelected = new EventEmitter<string[]>();
  @Output() searchOrCategoryChanged = new EventEmitter<void>();

  constructor(protected store: Store<any>) {
    super();
    this.store.dispatch(DataSourceActions.load());
    this.datasources$ = combineLatest([
      this.store.select(DataSourceSelectors.getDataSourcesSorted),
      this.selectedDatasources$
    ]).pipe(
      map(([datasources, selectedDatasources]) =>
        DatasourceUtils.getAllDatasourcesWithUnknowns(datasources, selectedDatasources)
      )
    );
    this.datasets$ = this.store.select(DataSourceSelectors.datasets);
    this.store.dispatch(DashboardActions.fetchManifestsList());

    this.store.dispatch(DataSourceActions.dataset.getCategories());
    this.categories$ = this.store.select(DataSourceSelectors.categories);
    this.store.dispatch(DataSourceActions.dataset.listVersions({}));
    this.subscriptions.add(
      this.selectedCategories$.subscribe((_) => {
        this.searchOrCategoryChanged.next();
      })
    );
    this.subscriptions.add(
      this.search$.pipe(debounceTime(100)).subscribe((_) => {
        this.searchOrCategoryChanged.next();
      })
    );
  }

  ngOnInit() {
    this.filteredDatasources$ = combineLatest([
      this._mode$,
      this.search$,
      this.selectedCategories$,
      this.selectedDatasources$,
      this.datasources$,
      this.datasets$
    ]).pipe(
      map(([mode, query, selectedCategories, selectedDs, datasources, datasets]) =>
        mode === 'list'
          ? this.search(datasets, query, selectedCategories)
          : this.search(datasources, query, selectedCategories)
              .map((dataset) => ({ ...dataset, isSelected: selectedDs.includes(dataset.id) }))
              .sort((a, b) => Number(b.isSelected) - Number(a.isSelected))
      )
    );
  }

  search(datasets: DataSource[], search: string, categories: Category[]): DataSource[] {
    return datasets
      .filter(
        (dataset) =>
          (search.length === 0 || dataset.name.toLowerCase().includes(search.toLowerCase())) &&
          (categories.length === 0 || this.doesDatasourceMatchCategoryFilter(dataset, categories))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  doesDatasourceMatchCategoryFilter(datasource: DataSource, selectedCategories: Category[]): boolean {
    return datasource.sourceType === 'dataset' && datasource.categories
      ? selectedCategories.reduce(
          (acc, selectedCat) => acc && datasource.categories!.map((cat) => cat.id).includes(selectedCat.id),
          true
        )
      : false;
  }

  onDatasourceClick({ isSelected, datasource }: { isSelected: boolean; datasource: DataSource }) {
    if (this._mode$.value === 'list') {
      this.consultedDataset.emit(datasource as Dataset);
    } else {
      this.selectedDatasources$.next(
        isSelected
          ? [...this.selectedDatasources$.value, datasource.id]
          : this.selectedDatasources$.value.filter((id) => id !== datasource.id)
      );
      this.datasourceSelected.emit(this.selectedDatasources$.value);
    }
  }
}
