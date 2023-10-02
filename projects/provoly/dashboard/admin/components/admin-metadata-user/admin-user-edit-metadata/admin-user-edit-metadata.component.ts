import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { MetadataActions, MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { Observable } from 'rxjs';
import { AdminMetadataUserActions } from '../store/admin-metadata-user.action';

@Component({
  selector: 'pry-admin-edit-metadata',
  templateUrl: './admin-user-edit-metadata.component.html'
})
export class AdminUserEditMetadataComponent implements OnInit {
  metadata$: Observable<IMetadata>;

  constructor(private readonly store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.metadata$ = this.store.select(MetadataSelectors.selectedMetadata);
    this.store.dispatch(MetadataActions.loadUserProfile());
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
