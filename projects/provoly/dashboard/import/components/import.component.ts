import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  DataSourceService,
  DateUtils,
  PryDatasetType,
  PryI18nService,
  PrySnackbarService,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { map, Observable, take } from 'rxjs';
import { ImportActions } from '../store/import.actions';
import { ImportSelectors } from '../store/import.selectors';
import { withLatestFrom } from 'rxjs/operators';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

type FileExtension = 'csv' | 'zip';

interface ImportForm {
  fileType: FormControl<FileExtension>;
  file: FormControl<File | null>;
  dataset: FormControl<Dataset | null>;
  normalizeGeo: FormControl<boolean>;
  productionDate: FormControl<string>;
  producer: FormControl<string>;
  additionalInformation: FormControl<string | null>;
}

@Component({
  selector: 'pry-import',
  templateUrl: './import.component.html'
})
export class PryImportComponent extends SubscriptionnerDirective implements OnDestroy {
  datasets$: Observable<Dataset[]>;
  loading$: Observable<boolean>;

  @ViewChild('message') message!: ElementRef<HTMLDivElement>;
  showMessage: boolean = false;

  maxDate = DateUtils.formatDate(new Date());

  form = new FormGroup<ImportForm>({
    fileType: new FormControl('csv', {
      validators: [Validators.required],
      nonNullable: true
    }),
    file: new FormControl(null, Validators.required),
    dataset: new FormControl(null, Validators.required),
    normalizeGeo: new FormControl(false, { nonNullable: true }),
    productionDate: new FormControl(this.maxDate, {
      validators: [Validators.required, DateUtils.onlyPastDateValidator],
      nonNullable: true
    }),
    producer: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    additionalInformation: new FormControl(null)
  });

  fileTypes: { [key in FileExtension]: { label: string; value: FileExtension; extension: string } } = {
    csv: {
      label: 'Csv',
      value: 'csv',
      extension: '.csv'
    },
    zip: {
      label: 'Shapefile',
      value: 'zip',
      extension: '.zip'
    }
  };

  constructor(
    private store: Store,
    private dsService: DataSourceService,
    private snackbar: PrySnackbarService,
    private i18nService: PryI18nService
  ) {
    super();
    store.dispatch(DataSourceActions.dataset.loadDataset());
    this.store.dispatch(DataSourceActions.dataset.listVersions());
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

    this.subscriptions.add(
      this.form.get('dataset')?.valueChanges
        .pipe(withLatestFrom(this.store.select(DataSourceSelectors.datasetVersions)))
        .subscribe(([dataset, versions]) => {
          this.clearMessage();
          if (dataset && versions.some((version) => version.dataset === dataset.id && version.state === 'ACTIVE')) {
            this.getLastActiveVersion(dataset);
          } else {
            this.form.patchValue({ producer: '', productionDate: DateUtils.formatDate(new Date()) });
            this.producer.markAsPristine();
          }
        })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.clearMessage();
  }

  get fileType(): AbstractControl<FileExtension> {
    return this.form.controls['fileType'];
  }

  get file(): AbstractControl<File | null> {
    return this.form.controls['file'];
  }

  get dataset(): AbstractControl<Dataset | null> {
    return this.form.controls['dataset'];
  }

  get normalizeGeo(): AbstractControl<boolean> {
    return this.form.controls['normalizeGeo'];
  }

  get productionDate(): AbstractControl<string> {
    return this.form.controls['productionDate'];
  }

  get producer(): AbstractControl<string> {
    return this.form.controls['producer'];
  }

  uploadedChange($event: File): void {
    if ($event.size > 1024 * 1024 * 1024 * 2) {
      this.snackbar.open({
        type: 'error',
        message: this.i18nService.instant('@pry.import.tooLarge', { current: this.getFileSize($event.size) })
      });
    } else {
      this.form.patchValue({ file: $event });
    }
  }

  submit(): void {
    const { file, dataset, fileType, normalizeGeo, producer, productionDate, additionalInformation } = this.form.value;
    if (file && dataset && fileType) {
      this.store.dispatch(
        ImportActions.upload({
          file,
          fileType,
          normalizeGeo,
          dataset: dataset.id,
          datasetVersionInformation: {
            productionDate: productionDate ? new Date(productionDate).toISOString() : undefined,
            producer,
            additionalInformation: !!additionalInformation ? additionalInformation : undefined
          }
        })
      );
      this.showMessage = true;
      setTimeout(() => this.message.nativeElement.scrollIntoView({ behavior: 'smooth' }));
      this.form.patchValue({ file: null });
    }
  }

  getFileSize(size: number): string {
    if (size >= 1024 && size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else if (size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    } else if (size >= 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    return `${size} bytes`;
  }

  getLastActiveVersion(dataset: Dataset): void {
    this.subscriptions.add(
      this.dsService
        .getLastActiveDatasetVersion(dataset.id)
        .pipe(take(1))
        .subscribe((version) => {
          if (version && version.producer) this.form.patchValue({ producer: version.producer });
        })
    );
  }

  clearMessage(): void {
    if (this.showMessage) this.showMessage = false;
  }

  protected readonly Object = Object;
  protected readonly PryDatasetType = PryDatasetType;
}
