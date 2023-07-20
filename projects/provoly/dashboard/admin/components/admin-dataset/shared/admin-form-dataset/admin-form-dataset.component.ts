import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassActions,
  ClassSelectors,
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  DataSourceState,
  PryDatasetType
} from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AdminActions } from '../../../../store/admin.actions';

@Component({
  selector: 'pry-admin-form-dataset',
  templateUrl: './admin-form-dataset.component.html'
})
export class AdminFormDatasetComponent implements OnInit, OnDestroy {
  @Input() dataset$?: Observable<Dataset | null>;

  datasetList$: Observable<Dataset[]>;
  datasetList: Dataset[] = [];
  datasetTypes: { label: string; value: string }[] = [];
  classes: Observable<Class[]>;

  sub = new Subscription();

  form: UntypedFormGroup;

  isSameName = false;
  isSubmitted = false;

  constructor(
    private store: Store<DataSourceState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder
  ) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(DataSourceActions.dataset.loadDataset());
    this.datasetList$ = this.store.select(DataSourceSelectors.datasets);
    this.classes = this.store.select(ClassSelectors.classes);
    this.form = this.formBuilder.group({
      id: [uuidv4()],
      name: ['', [Validators.required]],
      oClass: ['', [Validators.required]],
      type: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isSameName = false;
    this.sub = this.datasetList$.subscribe((dataset) => {
      this.datasetList = dataset;
    });
    this.datasetTypes = Object.keys(PryDatasetType).map((label) => ({
      label: '@pry.admin.dataset.' + label,
      value: label
    }));
    this.sub.add(
      this.dataset$?.subscribe((dataset: Dataset | null) => {
        if (dataset) {
          this.form.patchValue({
            id: dataset.id,
            name: dataset.name,
            oClass: dataset.oClass,
            type: dataset.type
          });
          this.form.controls['oClass'].disable();
          this.form.controls['type'].disable();
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath() }));
  }

  getPath() {
    let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
    if (this.dataset$) {
      path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
    }
    return path.toString();
  }

  changeValueName(value: string) {
    this.isSameName = false;
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitted = false;
      if (this.dataset$) {
        const path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
        this.store.dispatch(DataSourceActions.dataset.update({ dataset: this.form.value, route: path.toString() }));
        return;
      }
      const path = this.router.createUrlTree(['..'], { relativeTo: this.route });
      this.isSameName = !!this.datasetList.find(
        (dataset) => this.form.get('name')?.value.toLowerCase() === dataset.name.toLowerCase()
      );
      if (!this.isSameName) {
        this.store.dispatch(DataSourceActions.dataset.create({ dataset: this.form.value, route: path.toString() }));
      }
    }
  }
}
