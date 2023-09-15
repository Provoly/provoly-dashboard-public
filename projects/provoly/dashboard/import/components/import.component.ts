import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Dataset, DatasetVersion, DataSourceActions, DataSourceSelectors, PryDatasetType } from '@provoly/dashboard';
import { map, Observable } from 'rxjs';
import { ImportActions } from '../store/import.actions';
import { ImportSelectors } from '../store/import.selectors';

type FileExtension = 'csv' | 'zip';

@Component({
  selector: 'pry-import',
  templateUrl: './import.component.html'
})
export class PryImportComponent implements OnDestroy {
  datasets$: Observable<Dataset[]>;
  file?: File;
  datasetSelected?: string;
  selectedFileType: FileExtension = 'csv';
  loading$: Observable<boolean>;
  fileTypes: { label: string; value: FileExtension }[] = [
    {
      label: 'Csv',
      value: 'csv'
    },
    {
      label: 'Shapefile',
      value: 'zip'
    }
  ];

  fileExtension: Record<FileExtension, string> = {
    csv: '.csv',
    zip: '.zip'
  };
  showMessage: boolean = false;
  constructor(private store: Store) {
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
    this.loading$ = store.select(ImportSelectors.loading);
  }
  ngOnDestroy() {
    this.showMessage = false;
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
    if (this.file && this.datasetSelected && this.selectedFileType) {
      this.store.dispatch(
        ImportActions.upload({ file: this.file, dataset: this.datasetSelected, fileType: this.selectedFileType })
      );
      this.showMessage = true;
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

  onFileTypeChange(fileType: FileExtension) {
    this.selectedFileType = fileType;
  }
}
