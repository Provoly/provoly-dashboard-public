import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminMetadataUserActions } from '../store/admin-metadata-user.action';
import { AdminMetadataUserSelectors } from '../store/admin-metadata-user.selector';

@Component({
  selector: 'pry-admin-edit-metadata',
  templateUrl: './admin-user-edit-metadata.component.html'
})
export class AdminUserEditMetadataComponent implements OnInit {
  metadata$: Observable<IMetadata>;

  constructor(
    private readonly store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.metadata$ = this.store.select(AdminMetadataUserSelectors.selectedMetadata);
    this.store.dispatch(AdminMetadataUserActions.loadMetadata());
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.store.dispatch(AdminMetadataUserActions.goToDetailsViewMetadata({ id: params['uuid'] }));
    });
  }

  submit(metadata: IMetadata) {
    this.store.dispatch(AdminMetadataUserActions.updateMetadata({ metadata }));
  }
}
