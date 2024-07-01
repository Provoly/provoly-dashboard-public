import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Associations,
  DashboardSelectors,
  Dataset,
  DataSourceSelectors,
  MetadataValue,
  MissingGroupsByEntity,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  PryI18nService,
  PryShareMode,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { MetadataActions, MetadataSelectors, MetaEventType } from '@provoly/dashboard/components/metadata-editor';
import { BehaviorSubject, combineLatest, map, Observable, of, Subscription, withLatestFrom } from 'rxjs';
import { concatLatestFrom } from '@ngrx/operators';
import { AdminActions } from '../../../store/admin.actions';
import { AdminSelectors } from '../../../store/admin.selectors';
import { AdminDatasetActions } from '../store/admin-dataset.actions';
import { AdminDatasetSelectors } from '../store/admin-dataset.selectors';

interface MissingGroups {
  [key: string]: { groups: string[]; entityName: string };
}

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
  selectedDatasetMissingGroups$: Observable<MissingGroupsByEntity | undefined>;
  missingGroups$: Observable<MissingGroups | undefined>;
  shareRadioValue$ = new BehaviorSubject<PryShareMode | undefined>(undefined);
  disableShareButton$ = new BehaviorSubject<boolean>(false);

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private i18n: PryI18nService,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(PRY_ACCESS_TOKEN) protected access: PryBaseAccess
  ) {
    super();
    this.store.dispatch(MetadataActions.loadMetadata());
    this.selectedDataset$ = this.store.select(AdminDatasetSelectors.selectedDataset);
    this.datasetMetadata$ = this.store.select(AdminDatasetSelectors.selectedDatasetMetadata);
    this.associations$ = this.store.select(AdminSelectors.selectedAssociation);
    this.editable$ = this.store.select(MetadataSelectors.editable);
    this.selectedDatasetMissingGroups$ = this.store.select(AdminDatasetSelectors.selectedDatasetMissingGroups);
    this.missingGroups$ = this.selectedDatasetMissingGroups$.pipe(
      withLatestFrom(this.store.select(DashboardSelectors.manifestsList)),
      map(([conflict, manifests]) => {
        const result: { [key: string]: { groups: string[]; entityName: string } } = {};
        Object.keys(conflict ?? {}).forEach((entityId) => {
          result[entityId] = {
            groups: conflict?.[entityId] ?? [],
            entityName: manifests.find((m) => m.id === entityId)?.name ?? entityId
          };
        });
        return Object.keys(result).length > 0 ? result : undefined;
      })
    );
  }

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([this.selectedDataset$, this.store.select(DataSourceSelectors.datasetVersions)])
        .pipe(concatLatestFrom(([dataset, versions]) => (dataset ? this.canModify$(dataset) : of(false))))
        .subscribe(([[dataset, versions], canModify]) => {
          if (dataset) {
            this.accessGroups = dataset.groups ?? [];
            const editPath = this.router.createUrlTree(['.', 'dataset', 'edit', dataset.id], {
              relativeTo: this.route
            });
            if (canModify) {
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
                      action: AdminDatasetActions.confirmDatasetDeletion({
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
                      actionAccess: 'write',
                      disabled: versions.filter((v) => v.dataset === dataset.id).length > 0
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
    this.store.dispatch(AdminDatasetActions.unselectDataset());
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
    this.store.dispatch(AdminDatasetActions.update({ dataset: { ...dataset, groups: this.accessGroups }, route: '' }));
  }

  getGroupLabel(groupName: string) {
    const i18nBase = '@pry.components.chipsSelector.share.groups.';
    const label = this.i18n.instant(i18nBase + groupName, undefined, false);
    return label.startsWith(i18nBase) ? groupName : label;
  }

  changeGroup($event: string[]) {
    this.accessGroups = $event;
    this.updateDisableButtonValue();
    this.store.dispatch(AdminDatasetActions.setMissingGroups({ missingGroups: undefined }));
  }

  updateGroups($event: PryShareMode) {
    this.shareRadioValue$.next($event);
    this.updateDisableButtonValue();
  }

  updateDisableButtonValue() {
    if (this.shareRadioValue$.getValue() === PryShareMode.GROUPS && this.accessGroups.length === 0) {
      this.disableShareButton$.next(true);
    } else {
      if (this.disableShareButton$.getValue()) {
        this.disableShareButton$.next(false);
      }
    }
    this.cdr.detectChanges();
  }

  canModify$(dataset: Dataset) {
    return this.access ? this.access.canModifyDataset(dataset) : of(false);
  }
}
