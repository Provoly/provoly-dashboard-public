import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MetadataRules } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminMetadataRulesActions } from '../store/metadata-rules.actions';
import { MetadataRulesSelectors } from '../store/metadata-rules.selectors';

@Component({
  selector: 'pry-admin-select-metadata-rules',
  templateUrl: './admin-select-metadata-rules.component.html'
})
export class AdminSelectMetadataRulesComponent implements OnInit, OnDestroy {
  static id = 'AdminSelectMetadataRulesComponent';
  metadataRulesSelected$: Observable<MetadataRules | null>;
  sub = new Subscription();
  currentTypeTranslation = '';

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.metadataRulesSelected$ = this.store.select(MetadataRulesSelectors.metadataRulesSelected);
  }

  ngOnInit(): void {
    this.sub.add(
      this.metadataRulesSelected$.subscribe((metadata) => {
        if (metadata) {
          const editPath = this.router.createUrlTree(['.', 'metadata-rules', 'edit', metadata.id], {
            relativeTo: this.route
          });
          const metadataPath = this.router.createUrlTree(['.', 'metadata-rules'], { relativeTo: this.route });
          const addPath = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: AdminActions.routeTo({ path: editPath.toString() }),
                  label: 'edit',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'metadata_rules',
                  actionAccess: 'write'
                },
                {
                  action: AdminMetadataRulesActions.delete({
                    name: metadata.id,
                    route: metadataPath.toString(),
                    addRoute: addPath.toString()
                  }),
                  label: 'delete',
                  icon: 'delete',
                  moduleAccess: 'admin',
                  pageAccess: 'metadata_rules',
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
    const path = this.router.createUrlTree(['.', 'metadata-rules', 'new'], { relativeTo: this.route });
    this.store.dispatch(AdminMetadataRulesActions.unselectMetadata());
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
}
