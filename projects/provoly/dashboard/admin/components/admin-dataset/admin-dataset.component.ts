import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ClassActions,
  ClassSelectors,
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  DataSourceState,
  getShareLevel,
  PryI18nService
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { IConfigHeader } from '../admin-metadata/shared/list-metadata/pry-list-metadata.component';
import { AdminDatasetActions } from './store/admin-dataset.actions';
import { AdminDatasetSelectors } from './store/admin-dataset.selectors';

@Component({
  selector: 'pry-admin-dataset',
  templateUrl: './admin-dataset.component.html'
})
export class AdminDatasetComponent {
  @ViewChild('input') input!: ElementRef;
  datasetList$: Observable<Dataset[]>;
  selectedDataset$: Observable<string | undefined>;
  sortActive? = 'name';
  sortDirection? = 'asc';
  value: string = '';
  configHeader: Array<IConfigHeader>;
  labelDatasetSelected: string = '';
  editOpened: boolean = false;
  loading$: Observable<boolean>;

  validateAction: () => void;
  cancelAction: () => void;

  constructor(
    private store: Store<DataSourceState>,
    private translateService: PryI18nService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loading$ = this.store.select(ClassSelectors.loading);
    this.store.dispatch(DataSourceActions.dataset.loadDataset({}));
    this.store.dispatch(ClassActions.load({}));
    this.validateAction = () => this.validateName(this.labelDatasetSelected);
    this.cancelAction = () => this.cancelEdition();
    this.configHeader = [
      { headerType: 'label', label: this.translateService.instant('@pry.admin.dataset.name') },
      { headerType: 'label', label: this.translateService.instant('@pry.admin.dataset.oClass') },
      { headerType: 'label', label: this.translateService.instant('@pry.admin.dataset.type') }
    ];
    this.datasetList$ = this.store.select(DataSourceSelectors.datasets);
    this.selectedDataset$ = this.store.select(AdminDatasetSelectors.selectedDatasetId);
    this.store.dispatch(AdminDatasetActions.unselectDataset());
    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminDatasetActions.openNewDataset({ route: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'metadata_rules',
            actionAccess: 'write'
          }
        ]
      })
    );
  }

  cancelEdition(): void {
    this.toggleEditionDataset();
    this.store.dispatch(AdminDatasetActions.unselectDataset());
  }

  toggleEditionDataset(): void {
    this.editOpened = !this.editOpened;
    if (this.editOpened) {
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 10);
    }
  }

  validateName(newLabel: string): void {
    this.toggleEditionDataset();
  }

  changeValue($event: any) {
    this.labelDatasetSelected = $event;
  }

  selectDataset(dataset: Dataset) {
    this.store.dispatch(AdminActions.fetchDatasetAssociations({ id: dataset.id }));
    this.store.dispatch(AdminDatasetActions.selectDataset({ dataset }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminSelectDatasetComponent' }));
  }

  protected readonly getShareLevel = getShareLevel;
}
