import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { MetadataRules } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { MetadataState } from '../../admin-metadata/store/metadata.reducer';
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
