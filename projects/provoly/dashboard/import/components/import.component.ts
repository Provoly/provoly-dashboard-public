import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Dataset,
  DatasetVersion,
  DataSourceActions,
  DataSourceSelectors,
  DataSourceService,
  PryDatasetType,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { map, Observable, take } from 'rxjs';
import { ImportActions } from '../store/import.actions';
import { ImportSelectors } from '../store/import.selectors';
import { catchError } from 'rxjs/operators';

type FileExtension = 'csv' | 'zip';

@Component({
  selector: 'pry-import',
  templateUrl: './import.component.html'
})
export class PryImportComponent extends SubscriptionnerDirective implements OnDestroy {
  datasets$: Observable<Dataset[]>;
  file?: File;
  selectedDataset?: Dataset;
  selectedFileType: FileExtension = 'csv';
  loading$: Observable<boolean>;
  normalizeGeoShape = false;
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
  productionDate: string = new Date().toISOString().replace(/:\d+\.\d+Z$/, '');
  producer: string = '';
  additionalInformation: string = '';
  maxDate = new Date().toISOString().replace('Z', '');

  constructor(
    private store: Store,
    private dsService: DataSourceService
  ) {
    super();
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

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.showMessage = false;
  }

  uploadedChange($event: File) {
    this.file = $event;
  }

  submit() {
    if (this.file && this.selectedDataset && this.selectedFileType) {
      this.store.dispatch(
        ImportActions.upload({
          file: this.file,
          dataset: this.selectedDataset.id,
          fileType: this.selectedFileType,
          normalizeGeo: this.normalizeGeoShape,
          datasetVersionInformation: {
            productionDate: new Date(this.productionDate).toISOString(),
            producer: this.producer,
            additionalInformation: this.additionalInformation.length > 0 ? this.additionalInformation : undefined
          }
        })
      );
      this.showMessage = true;
      this.file = undefined;
    }
  }

  isSubmitDisabled() {
    return (
      this.file === undefined ||
      this.selectedDataset === undefined ||
      (this.selectedDataset?.type === PryDatasetType.CLOSED && (this.productionDate === '' || this.producer === ''))
    );
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

  getLastActiveVersion($event?: Dataset) {
    if ($event) {
      this.subscriptions.add(
        this.dsService
          .getLastActiveDatasetVersion($event.id)
          .pipe(
            take(1),
            catchError(() => [])
          )
          .subscribe((version) => {
            if (version && version.producer) {
              this.producer = version.producer || '';
            }
          })
      );
    }
  }
}
