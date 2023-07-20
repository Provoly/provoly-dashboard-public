import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata, PryI18nService } from '@provoly/dashboard';
import { Observable, Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminActions } from '../../store/admin.actions';
import { IConfigHeader } from '../admin-metadata/shared/list-metadata/pry-list-metadata.component';
import { AdminMetadataUserActions } from './store/admin-metadata-user.action';
import { AdminMetadataUserSelectors } from './store/admin-metadata-user.selector';

@Component({
  selector: 'pry-admin-user',
  templateUrl: './admin-metadata-user.component.html'
})
export class AdminMetadataUserComponent {
  @ViewChild('input') input!: ElementRef;

  metadata$: Observable<Array<IMetadata>>;
  selectedMetadataId$: Observable<string>;

  sortActive? = 'name';

  sortDirection? = 'asc';

  value: string = '';

  configHeader: Array<IConfigHeader>;

  unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private store: Store<any>,
    private translateService: PryI18nService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.configHeader = [
      { headerType: 'label', label: this.translateService.instant('@pry.admin.user.label') },
      { headerType: 'label', label: this.translateService.instant('@pry.admin.user.type') }
    ];
    this.metadata$ = this.store.select(AdminMetadataUserSelectors.metadata);
    this.selectedMetadataId$ = this.store.select(AdminMetadataUserSelectors.selectedMetadataId);
    this.store.dispatch(AdminMetadataUserActions.unselectMetadata());
    this.store.dispatch(AdminMetadataUserActions.loadMetadata());
    this.store
      .select(AdminMetadataUserSelectors.selectedMetadata)
      .pipe(
        filter((x) => !!x),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedMetadata) => {
        this.value = selectedMetadata.name;
      });
    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
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

  rowClicked(id: string) {
    this.store.dispatch(AdminMetadataUserActions.goToDetailsViewMetadata({ id }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminUserSelectMetadataComponent' }));
  }
}
