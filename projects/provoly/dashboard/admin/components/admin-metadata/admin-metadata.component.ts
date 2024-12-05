import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata, PryI18nService } from '@provoly/dashboard';
import { MetadataActions, MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { Observable, Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { IConfigHeader } from './shared/list-metadata/pry-list-metadata.component';

@Component({
  selector: 'pry-admin-metadata',
  templateUrl: './admin-metadata.component.html'
})
export class AdminMetadataComponent {
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
      { headerType: 'label', label: this.translateService.instant('@pry.admin.metadata.label') },
      { headerType: 'label', label: this.translateService.instant('@pry.admin.metadata.type') }
    ];
    this.metadata$ = this.store.select(MetadataSelectors.metadata);
    this.selectedMetadataId$ = this.store.select(MetadataSelectors.selectedMetadataId);
    this.store.dispatch(MetadataActions.unselectMetadata());
    this.store.dispatch(MetadataActions.loadMetadata());
    this.store
      .select(MetadataSelectors.selectedMetadata)
      .pipe(
        filter((x) => !!x),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedMetadata) => {
        this.value = selectedMetadata.name;
      });
    const path = this.router.createUrlTree(['new'], { relativeTo: this.route });
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: MetadataActions.goToNewMetadata({ route: path.toString() }),
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

  cancelEdition(): void {
    this.store.dispatch(MetadataActions.unselectMetadata());
  }

  rowClicked(id: string) {
    this.store.dispatch(MetadataActions.goToDetailsView({ id }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminSelectMetadataComponent' }));
  }
}
