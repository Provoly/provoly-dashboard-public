import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetadataRules } from '@provoly/dashboard';
import { MetadataState } from '@provoly/dashboard/components/metadata-editor';
import { Observable } from 'rxjs';
import { AdminMetadataRulesActions } from '../store/metadata-rules.actions';
import { MetadataRulesSelectors } from '../store/metadata-rules.selectors';

@Component({
  selector: 'pry-admin-edit-metadata-rules',
  templateUrl: './admin-edit-metadata-rules.component.html'
})
export class AdminEditMetadataRulesComponent {
  metadataRulesSelected$: Observable<MetadataRules | null>;

  constructor(private store: Store<MetadataState>) {
    this.store.dispatch(AdminMetadataRulesActions.load());
    this.metadataRulesSelected$ = this.store.select(MetadataRulesSelectors.metadataRulesSelected);
  }
}
