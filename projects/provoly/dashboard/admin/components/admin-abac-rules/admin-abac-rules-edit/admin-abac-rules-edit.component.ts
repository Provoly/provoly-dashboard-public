import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClassActions, FieldActions } from '@provoly/dashboard';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';
import { AdminActions } from '../../../store/admin.actions';
import { AdminMetadataUserActions } from '../../admin-metadata-user/store/admin-metadata-user.action';
import { PredicatesActions } from '../../admin-predicates/store/predicates.actions';
import { AbacRulesActions } from '../store/abac-rules.actions';

@Component({
  selector: 'pry-admin-abac-rules-edit',
  templateUrl: './admin-abac-rules-edit.component.html'
})
export class AdminAbacRulesEditComponent implements OnInit, OnDestroy {
  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(PredicatesActions.loadPredicates());
    this.store.dispatch(MetadataActions.loadMetadata());
    this.store.dispatch(AdminMetadataUserActions.loadMetadata());
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const backPath = this.router.createUrlTree(['..'], { relativeTo: this.route });
      this.store.dispatch(
        AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: backPath.toString() }),
              label: 'back',
              icon: 'arrow_back'
            }
          ]
        })
      );
      const ruleId = params['id'];
      this.store.dispatch(AbacRulesActions.fetchAbacRule({ id: ruleId }));
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(AbacRulesActions.resetEditAbacRule());
  }
}
