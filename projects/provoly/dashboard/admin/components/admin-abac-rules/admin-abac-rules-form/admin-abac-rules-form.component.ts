import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { PredicatesSelectors } from '../../admin-predicates/store/predicates.selectors';
import { AbacRulesActions } from '../store/abac-rules.actions';
import { AbacRule, AbacRuleType, ConditionType } from '../store/abac-rules.model';
import { AbacRulesSelectors } from '../store/abac-rules.selectors';

@Component({
  selector: 'pry-admin-abac-rules-form',
  templateUrl: './admin-abac-rules-form.component.html'
})
export class AdminAbacRulesFormComponent {
  readonly ATTRIBUTE: ConditionType = 'ATTRIBUTE';
  readonly METADATA: ConditionType = 'METADATA';
  @Input() readonly = false;
  @Input() edit = false;

  predicates$: Observable<Predicate[]>;
  editAbacRuleType$: Observable<AbacRuleType | undefined>;

  isSubmitted = false;

  editAbacRuleConditionsMasterId$: Observable<string | null>;
  typeSelected$: Observable<string | undefined>;
  editAbacRule$: Observable<AbacRule | null>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.predicates$ = this.store.select(PredicatesSelectors.predicates);
    this.editAbacRule$ = this.store.select(AbacRulesSelectors.editAbacRule);
    this.editAbacRuleType$ = this.store.select(AbacRulesSelectors.editAbacRuleType);
    this.editAbacRuleConditionsMasterId$ = this.store.select(AbacRulesSelectors.editAbacRuleConditionsMasterId);
    this.typeSelected$ = this.store.select(AbacRulesSelectors.editAbacRuleConditionsTypeSelected);
  }

  toPredicate(item: Predicate): Predicate {
    return item;
  }

  onChangeAbacRuleProperty(property: keyof AbacRule, value: string): void {
    this.store.dispatch(AbacRulesActions.updateEditAbacRuleByProperty({ property, value }));
  }

  onCreateAbacRule(form: NgForm): void {
    this.isSubmitted = true;
    if (form.valid) {
      this.isSubmitted = false;
      const backPath = this.router.createUrlTree(['..'], { relativeTo: this.route });
      this.store.dispatch(AbacRulesActions.saveEditAbacRule({ redirect: backPath.toString() }));
    }
  }

  goBack() {
    const backPath = this.router.createUrlTree(['..'], { relativeTo: this.route });
    this.store.dispatch(AbacRulesActions.cancelAbacRuleEdition({ redirect: backPath.toString() }));
  }
}
