import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata, META_OPTIONS } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminMetadataUserActions } from '../store/admin-metadata-user.action';
import { AdminMetadataUserSelectors } from '../store/admin-metadata-user.selector';

let nextCompId = 0;

@Component({
  selector: 'pry-admin-user-select-metadata',
  templateUrl: './admin-user-select-metadata.component.html'
})
export class AdminUserSelectMetadataComponent implements OnInit, OnDestroy {
  static id = 'AdminUserSelectMetadataComponent';
  compId: number;

  metadata$: Observable<IMetadata | undefined>;
  sub = new Subscription();
  currentTypeTranslation = '';
  tab: number = 0;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.metadata$ = this.store.select(AdminMetadataUserSelectors.selectedMetadata);
    this.sub.add(
      this.metadata$.subscribe((meta) => {
        const type = META_OPTIONS.find((el) => el.varType === meta?.type);
        this.currentTypeTranslation = type ? type.translation : META_OPTIONS[0].translation;
      })
    );

    this.compId = nextCompId++;
  }

  ngOnInit(): void {
    this.sub.add(
      this.metadata$.subscribe((metadata) => {
        if (metadata) {
          const editPath = this.router.createUrlTree(['.', 'metadata-user', 'edit', metadata.id], {
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
                  pageAccess: 'metadata_user',
                  actionAccess: 'write'
                }
              ]
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  closePanel() {
    const path = this.router.createUrlTree(['.', 'user', 'metadata', 'new'], { relativeTo: this.route });
    this.store.dispatch(AdminMetadataUserActions.unselectMetadata());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'metadata_user',
            actionAccess: 'write'
          }
        ]
      })
    );
  }
}
