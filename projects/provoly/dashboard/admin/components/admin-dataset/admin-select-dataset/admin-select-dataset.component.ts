import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Associations,
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  MetadataValue,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { MetadataActions, MetadataSelectors, MetaEventType } from '@provoly/dashboard/components/metadata-editor';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminSelectors } from '../../../store/admin.selectors';

@Component({
  selector: 'pry-admin-select-dataset',
  templateUrl: './admin-select-dataset.component.html'
})
export class AdminSelectDatasetComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  static id = 'AdminSelectDatasetComponent';
  selectedDataset$: Observable<Dataset | null>;
  associations$: Observable<Associations | undefined>;
  sub = new Subscription();
  currentTypeTranslation = '';
  datasetMetadata$: Observable<MetadataValue[]>;
  editable$: Observable<boolean>;
  accessGroups: string[] = [];

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    super();
    this.store.dispatch(MetadataActions.loadMetadata());
    this.selectedDataset$ = this.store.select(DataSourceSelectors.selectedDataset);
    this.datasetMetadata$ = this.store.select(DataSourceSelectors.selectedDatasetMetadata);
    this.associations$ = this.store.select(AdminSelectors.selectedAssociation);
    this.editable$ = this.store.select(MetadataSelectors.editable);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.selectedDataset$.subscribe((dataset) => {
        if (dataset) {
          this.accessGroups = dataset?.groups ?? [];
          const editPath = this.router.createUrlTree(['.', 'dataset', 'edit', dataset.id], {
            relativeTo: this.route
          });
          if (dataset.owner) {
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
                      addRoute: this.router
                        .createUrlTree(['.', 'dataset', 'new'], { relativeTo: this.route })
                        .toString()
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
          } else {
            this.store.dispatch(
              AdminActions.mainActions({
                actions: []
              })
            );
          }
        }
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

  removeMetadata(metadata: MetaEventType) {
    this.store.dispatch(
      MetadataActions.deleteDatasetMetadata({ datasetId: metadata.id, metadataId: metadata.metadataId })
    );
  }

  addDatasetMetadata(metadata: MetaEventType) {
    this.store.dispatch(
      MetadataActions.addDatasetMetadata({
        datasetId: metadata.id,
        metadataId: metadata.metadataId,
        value: metadata.value
      })
    );
  }

  share(dataset: Dataset) {
    this.store.dispatch(
      DataSourceActions.dataset.update({ dataset: { ...dataset, groups: this.accessGroups }, route: '' })
    );
  }
}
