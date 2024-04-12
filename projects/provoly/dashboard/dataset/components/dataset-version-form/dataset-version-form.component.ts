import { DatasetVersion, DataSourceActions } from '@provoly/dashboard';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

interface DatasetVersionInfoForm {
  productionDate: FormControl<string>;
  producer: FormControl<string>;
  additionalInformation: FormControl<string>;
}

@Component({
  selector: 'pry-dataset-version-form',
  templateUrl: './dataset-version-form.component.html'
})
export class PryDatasetVersionFormComponent implements OnInit {
  @Input() version?: DatasetVersion;
  form = new FormGroup<DatasetVersionInfoForm>({
    productionDate: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    producer: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)],
      nonNullable: true
    }),
    additionalInformation: new FormControl('', { validators: [Validators.required], nonNullable: true })
  });
  maxDate = new Date().toISOString().replace('Z', '');

  @Output() formValidated = new EventEmitter<Partial<DatasetVersion>>();

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.version) {
      this.form.patchValue({
        producer: this.version.producer,
        additionalInformation: this.version.additionalInformation
      });
      if (this.version.productionDate) {
        this.form.patchValue({
          productionDate: new Date(this.version.productionDate).toISOString().replace('Z', '')
        });
      }
    }
  }

  onSubmit() {
    if (this.version) {
      this.store.dispatch(
        DataSourceActions.dataset.updateDatasetVersionInfo({
          version: {
            ...this.version,
            ...this.form.value,
            productionDate: new Date(this.form.value.productionDate ?? '').toISOString()
          }
        })
      );
    }
    this.formValidated.emit();
  }
}
