import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { MetadataActions } from '../store/metadata.action';
import { MetadataSelectors } from '../store/metadata.selector';

@Component({
  selector: 'pry-admin-edit-metadata',
  templateUrl: './admin-edit-metadata.component.html'
})
export class AdminEditMetadataComponent implements OnInit {
  metadata$?: Observable<IMetadata>;

  constructor(
    private readonly store: Store<any>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(MetadataActions.loadMetadata());
    this.metadata$ = this.store.select(MetadataSelectors.selectedMetadata);
    this.route.params.subscribe((params) => {
      this.store.dispatch(MetadataActions.goToDetailsView({ id: params['uuid'] }));
    });
  }

  submit(metadata: IMetadata) {
    this.store.dispatch(MetadataActions.createMetadata({ metadata: metadata }));
  }
}
