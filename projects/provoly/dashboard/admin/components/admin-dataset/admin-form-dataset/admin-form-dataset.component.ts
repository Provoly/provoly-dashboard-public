import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Category,
  Class,
  ClassActions,
  ClassSelectors,
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  DataSourceState,
  PryDatasetType,
  PryDialogService,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AdminDatasetActions } from '../store/admin-dataset.actions';
import { AdminDatasetSelectors } from '../store/admin-dataset.selectors';
import { AdminActions } from '../../../store/admin.actions';
import { AddCategoryModalComponent } from '../../shared/add-category-modal/add-category-modal.component';

@Component({
  selector: 'pry-admin-form-dataset',
  templateUrl: './admin-form-dataset.component.html'
})
export class AdminFormDatasetComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  @Input() dataset$?: Observable<Dataset | null>;

  datasetList$: Observable<Dataset[]>;
  datasetList: Dataset[] = [];
  datasetTypes: { label: string; value: string }[] = [];
  classes$: Observable<Class[]>;
  categories$: Observable<Category[]>;

  form!: UntypedFormGroup;

  isSameName = false;
  isSubmitted = false;

  constructor(
    private store: Store<DataSourceState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private dialog: PryDialogService
  ) {
    super();
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(DataSourceActions.dataset.loadDataset());
    this.store.dispatch(AdminDatasetActions.getCategories());
    this.datasetList$ = this.store.select(DataSourceSelectors.datasets);
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.categories$ = this.store.select(AdminDatasetSelectors.categories);

    this.form = this.formBuilder.group({
      id: [uuidv4()],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      oClass: ['', [Validators.required]],
      type: ['', [Validators.required]],
      description: ['', [Validators.maxLength(500)]],
      categories: [[]]
    });
  }

  ngOnInit(): void {
    this.isSameName = false;
    this.subscriptions.add(
      this.datasetList$.subscribe((dataset) => {
        this.datasetList = dataset;
      })
    );

    this.datasetTypes = Object.keys(PryDatasetType).map((label) => ({
      label: '@pry.admin.dataset.' + label,
      value: label
    }));

    this.subscriptions.add(
      this.dataset$?.subscribe((dataset: Dataset | null) => {
        if (dataset) {
          this.form.patchValue({
            id: dataset.id,
            name: dataset.name,
            oClass: dataset.oClass,
            type: dataset.type,
            description: dataset.description,
            categories: dataset.categories
          });

          this.form.controls['oClass'].disable();
          this.form.controls['type'].disable();
        }
      })
    );
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
        this.store.dispatch(AdminDatasetActions.update({ dataset: this.form.getRawValue(), route: path.toString() }));
        return;
      }
      const path = this.router.createUrlTree(['..'], { relativeTo: this.route });
      this.isSameName = !!this.datasetList.find(
        (dataset) => this.form.get('name')?.value.toLowerCase() === dataset.name.toLowerCase()
      );
      if (!this.isSameName) {
        this.store.dispatch(AdminDatasetActions.create({ dataset: this.form.getRawValue(), route: path.toString() }));
      }
    }
  }

  openModal() {
    const ref = this.dialog.open(AddCategoryModalComponent);
    ref.component!.entityType = 'dataset';
    this.subscriptions.add(
      ref.component!.category.subscribe((category) => {
        if (!this.form.get('categories')?.value?.some((cat: Category) => cat.id === category.id)) {
          this.form.patchValue({
            categories: [...(this.form.get('categories')?.value ?? []), category]
          });
        }
      })
    );
    this.subscriptions.add(ref.component!.closeModal.subscribe(() => ref.close()));
  }
}
