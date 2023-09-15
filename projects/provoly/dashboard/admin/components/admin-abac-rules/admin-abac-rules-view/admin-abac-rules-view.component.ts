import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClassActions, FieldActions } from '@provoly/dashboard';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';
import { AdminActions } from '../../../store/admin.actions';
import { PredicatesActions } from '../../admin-predicates/store/predicates.actions';
import { AbacRulesActions } from '../store/abac-rules.actions';

@Component({
  selector: 'pry-admin-abac-rules-view',
  templateUrl: './admin-abac-rules-view.component.html'
})
export class AdminAbacRulesViewComponent implements OnInit {
  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(PredicatesActions.loadPredicates());
    this.store.dispatch(MetadataActions.loadMetadata());
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const path = this.router.createUrlTree(['.', 'edit'], { relativeTo: this.route });
      const backPath = this.router.createUrlTree(['..'], { relativeTo: this.route });
      this.store.dispatch(
        AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: backPath.toString() }),
              label: 'back',
              icon: 'arrow_back'
            },
            {
              action: AdminActions.routeTo({ path: path.toString() }),
              label: 'edit',
              icon: 'edit',
              moduleAccess: 'admin',
              pageAccess: 'abac_rules',
              actionAccess: 'write'
            }
          ]
        })
      );
      const ruleId = params['id'];
      this.store.dispatch(AbacRulesActions.fetchAbacRule({ id: ruleId }));
    });
  }
}
