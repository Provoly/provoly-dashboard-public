import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata, META_OPTIONS } from '@provoly/dashboard';
import { MetadataActions, MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';

@Component({
  selector: 'pry-select-metadata',
  templateUrl: './admin-select-metadata.component.html'
})
export class AdminSelectMetadataComponent implements OnInit, OnDestroy {
  static id = 'AdminSelectMetadataComponent';
  metadata$: Observable<IMetadata | undefined>;
  sub = new Subscription();
  currentTypeTranslation = '';

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.metadata$ = this.store.select(MetadataSelectors.selectedMetadata);
    this.sub.add(
      this.metadata$.subscribe((meta) => {
        const type = META_OPTIONS.find((el) => el.varType === meta?.type);
        this.currentTypeTranslation = type ? type.translation : META_OPTIONS[0].translation;
      })
    );
  }

  ngOnInit(): void {
    this.sub.add(
      this.metadata$.subscribe((metadata) => {
        if (metadata) {
          const editPath = this.router.createUrlTree(['.', 'metadata', 'edit', metadata.id], {
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
                  pageAccess: 'metadata',
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
    const path = this.router.createUrlTree(['.', 'metadata', 'new'], { relativeTo: this.route });
    this.store.dispatch(MetadataActions.unselectMetadata());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'metadata',
            actionAccess: 'write'
          }
        ]
      })
    );
  }
}
