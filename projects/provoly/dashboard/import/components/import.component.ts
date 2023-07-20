import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Dataset, DataSourceActions, DataSourceSelectors, PryDatasetType, PryI18nService } from '@provoly/dashboard';
import { map, Observable } from 'rxjs';
import { ImportActions, ImportError } from '../store/import.actions';
import { ImportSelectors } from '../store/import.selectors';

@Component({
  selector: 'pry-import',
  templateUrl: './import.component.html'
})
export class PryImportComponent {
  datasets$: Observable<Dataset[]>;
  file?: File;
  datasetSelected?: string;
  numberOfLine$: Observable<number>;
  errors$: Observable<{ [p: string | number]: ImportError[] } | null>;
  errorCount$: Observable<number | null>;
  fileTypes: { label: string; value: string }[] = [
    {
      label: 'Csv',
      value: 'csv'
    }
  ];

  constructor(
    private store: Store,
    private translateService: PryI18nService
  ) {
    store.dispatch(DataSourceActions.dataset.loadDataset());

    this.datasets$ = store
      .select(DataSourceSelectors.datasets)
      .pipe(
        map((datasets) =>
          datasets
            .filter((dataset) => dataset.type === PryDatasetType.CLOSED)
            .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
        )
      );
    this.numberOfLine$ = store.select(ImportSelectors.numberOfLines);
    this.errors$ = store.select(ImportSelectors.errors);
    this.errorCount$ = this.errors$.pipe(
      map((errors) => {
        if (errors) {
          return Object.values(errors).flat().length;
        }
        return null;
      })
    );
  }

  sortObjectEntries(obj: any) {
    let arraySorted: any = [];
    Object.keys(obj)
      .sort((a: any, b: any) => a - b)
      .forEach((el) => (arraySorted[el] = obj[el]));
    return arraySorted;
  }

  uploadedChange($event: File) {
    this.file = $event;
  }

  submit() {
    if (this.file && this.datasetSelected) {
      this.store.dispatch(ImportActions.upload({ file: this.file, dataset: this.datasetSelected }));
      this.file = undefined;
    }
  }

  isSubmitDisabled() {
    return this.file === undefined || this.datasetSelected === undefined;
  }

  getFileSize(size: number) {
    if (size >= 1000 && size < 1000000) {
      return `${(size / 1000).toFixed(1)} KB`;
    } else if (size >= 1000000) {
      return `${(size / 1000000).toFixed(1)} MB`;
    }
    return `${size} bytes`;
  }
}
