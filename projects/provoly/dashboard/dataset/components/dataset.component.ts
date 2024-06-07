import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Category,
  ClassActions,
  ConfigActions,
  DashboardActions,
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  FieldActions,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';

@Component({
  selector: 'pry-dataset',
  templateUrl: './dataset.component.html'
})
export class PryDatasetComponent extends SubscriptionnerDirective {
  datasets$: Observable<Dataset[]>;
  selectedDataset: Dataset | null = null;
  selectedMode: ViewMode = ViewMode.CATALOG;
  ViewMode = ViewMode;
  search$ = new BehaviorSubject('');
  filteredDatasets$: Observable<Dataset[]>;
  categories$: Observable<Category[]>;
  selectedCategories = [];
  selectedCategories$ = new Subject<Category[]>();

  constructor(protected store: Store<any>) {
    super();
    this.store.dispatch(DataSourceActions.load());
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(ConfigActions.loadCustomization());

    this.datasets$ = this.store.select(DataSourceSelectors.datasets);
    this.store.dispatch(DashboardActions.fetchManifestsList());

    this.store.dispatch(DataSourceActions.dataset.getCategories());
    this.categories$ = this.store.select(DataSourceSelectors.categories);

    this.filteredDatasets$ = combineLatest([this.datasets$, this.search$, this.selectedCategories$]).pipe(
      map(([datasets, search, selectedCategories]) =>
        datasets
          .filter(
            (dataset) =>
              (search.length === 0 || dataset.name.toLowerCase().includes(search.toLowerCase())) &&
              (selectedCategories.length === 0 || this.doesDatasetMatchCategoryFilter(dataset, selectedCategories))
          )
          .sort((a, b) => a.name.localeCompare(b.name))
      )
    );
    this.store.dispatch(DataSourceActions.dataset.listVersions());
  }

  consult(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.selectedMode = ViewMode.CONSULT;
    this.search$.next('');
  }

  doesDatasetMatchCategoryFilter(dataset: Dataset, selectedCategories: Category[]): boolean {
    return dataset.categories
      ? selectedCategories.reduce(
          (acc, selectedCat) => acc && dataset.categories!.map((cat) => cat.id).includes(selectedCat.id),
          true
        )
      : false;
  }
}
