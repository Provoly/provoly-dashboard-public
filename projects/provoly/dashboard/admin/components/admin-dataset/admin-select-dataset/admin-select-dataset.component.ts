import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Associations,
  Dataset,
  DatasetMetadata,
  DataSourceActions,
  DataSourceSelectors,
  IMetadata,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { MetadataActions } from '../../admin-metadata/store/metadata.action';
import { MetadataSelectors } from '../../admin-metadata/store/metadata.selector';
import { AdminDatasetActions } from '../store/admin-dataset.actions';
import { AdminDatasetSelectors } from '../store/admin-dataset.selector';
import { AdminSelectors } from '../../../store/admin.selectors';

let nextCompId = 0;

@Component({
  selector: 'pry-admin-select-dataset',
  templateUrl: './admin-select-dataset.component.html'
})
export class AdminSelectDatasetComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  static id = 'AdminSelectDatasetComponent';
  compId: number;
  selectedDataset$: Observable<Dataset | null>;
  associations$: Observable<Associations | undefined>;
  sub = new Subscription();
  currentTypeTranslation = '';
  tab: number = 0;
  datasetMetadata$: Observable<DatasetMetadata[]>;
  metadata$: Observable<IMetadata[]>;
  availableMetadata$?: Observable<IMetadata[]>;
  form: FormGroup;
  isSubmitted = false;
  editable$: Observable<boolean>;
  datasetId = '';

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    super();
    this.store.dispatch(MetadataActions.loadMetadata());
    this.selectedDataset$ = this.store.select(DataSourceSelectors.selectedDataset);
    this.datasetMetadata$ = this.store.select(DataSourceSelectors.selectedDatasetMetadata);
    this.associations$ = this.store.select(AdminSelectors.selectedAssociation);
    this.metadata$ = this.store.select(MetadataSelectors.metadata);
    this.editable$ = this.store.select(AdminDatasetSelectors.editable);
    this.compId = nextCompId++;

    this.form = this.formBuilder.group({
      metadata: [{}, [Validators.required]],
      value: ['', [Validators.required, Validators.pattern('^[+-]?[0-9]*$')]]
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedDataset$.subscribe((dataset) => {
        if (dataset) {
          this.datasetId = dataset.id;
          const editPath = this.router.createUrlTree(['.', 'dataset', 'edit', dataset.id], {
            relativeTo: this.route
          });
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: AdminActions.routeTo({ path: editPath.toString() }),
                  label: 'edit',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'dataset',
                  actionAccess: 'write'
                },
                {
                  action: DataSourceActions.dataset.confirmDataSourceDeletion({
                    name: dataset.id,
                    route: this.router.createUrlTree(['.', 'dataset'], { relativeTo: this.route }).toString(),
                    addRoute: this.router.createUrlTree(['.', 'dataset', 'new'], { relativeTo: this.route }).toString()
                  }),
                  label: 'delete',
                  icon: 'delete',
                  moduleAccess: 'admin',
                  pageAccess: 'dataset',
                  actionAccess: 'write'
                }
              ]
            })
          );
        }
      })
    );
    this.subscriptions.add(
      this.selectedDataset$.subscribe((dataset) => {
        if (dataset) {
          this.availableMetadata$?.subscribe((meta) => {
            this.form.patchValue({
              metadata: meta[0]
            });
            this.onMetaChange(meta[0]);
            this.form.patchValue({ value: '' });
          });
        }
      })
    );
    this.availableMetadata$ = combineLatest([this.datasetMetadata$, this.metadata$]).pipe(
      map(([datasetMetadata, metaDefs]) => {
        let datasetMetadataIds = datasetMetadata?.map((u) => u.metadataDef.id);
        return metaDefs.filter((meta) => !datasetMetadataIds?.includes(meta.id));
      })
    );
  }

  closePanel() {
    const path = this.router.createUrlTree(['.', 'dataset', 'new'], { relativeTo: this.route });
    this.store.dispatch(DataSourceActions.dataset.unselectDataset());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
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

  addDatasetMetadata() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitted = false;
      let payload = {
        datasetId: this.datasetId,
        metadataId: this.form.value['metadata']['id'],
        value: this.form.value['value']
      };
      this.store.dispatch(AdminDatasetActions.addDatasetMetadata(payload));
    }
  }

  onMetaChange(metadata: IMetadata) {
    if (metadata) {
      if (metadata.type === 'INTEGER') {
        this.form.controls['value'].setValidators([Validators.required, Validators.pattern('^[+-]?[0-9]*$')]);
      } else if (metadata.type === 'DOUBLE') {
        this.form.controls['value'].setValidators([Validators.required, Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')]);
      } else {
        this.form.controls['value'].setValidators([Validators.required]);
      }
    }
  }

  removeMetadata(metadata: DatasetMetadata) {
    this.store.dispatch(
      AdminDatasetActions.deleteDatasetMetadata({ datasetId: this.datasetId, metadataId: metadata.metadataDef.id })
    );
  }

  editMetadata(currentMetadata: DatasetMetadata) {
    this.store.dispatch(AdminDatasetActions.isEditable({ editable: true }));
    let value = currentMetadata.value;
    let datasetMetadataDef = currentMetadata.metadataDef;

    this.form.patchValue({
      metadata: datasetMetadataDef,
      value: value
    });
    this.onMetaChange(datasetMetadataDef);
  }

  switch(number: number) {
    this.tab = number;
  }
}
