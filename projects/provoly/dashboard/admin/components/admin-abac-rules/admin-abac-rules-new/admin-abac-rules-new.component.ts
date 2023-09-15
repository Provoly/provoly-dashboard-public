import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClassActions, FieldActions } from '@provoly/dashboard';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';
import { AdminMetadataUserActions } from '../../admin-metadata-user/store/admin-metadata-user.action';
import { PredicatesActions } from '../../admin-predicates/store/predicates.actions';
import { AbacRulesActions } from '../store/abac-rules.actions';
import { AbacRulesService } from '../store/abac-rules.service';

@Component({
  selector: 'pry-admin-abac-rules-new',
  templateUrl: './admin-abac-rules-new.component.html'
})
export class AdminAbacRulesNewComponent implements OnDestroy {
  constructor(private store: Store<any>, private abacRuleService: AbacRulesService) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(PredicatesActions.loadPredicates());
    this.store.dispatch(MetadataActions.loadMetadata());
    this.store.dispatch(AdminMetadataUserActions.loadMetadata());
    const newRule = this.abacRuleService.initializeNewAbacRule();
    this.store.dispatch(AbacRulesActions.initEditAbacRule({ rule: newRule }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(AbacRulesActions.resetEditAbacRule());
  }
}
