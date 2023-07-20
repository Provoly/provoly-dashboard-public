import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { filter, Observable, of, switchMap } from 'rxjs';
import { AdminMetadataUserSelectors } from '../../../admin-metadata-user/store/admin-metadata-user.selector';
import { MetadataSelectors } from '../../../admin-metadata/store/metadata.selector';
import { AbacRulesActions } from '../../store/abac-rules.actions';
import { NormalizedCondition, OperatorType } from '../../store/abac-rules.model';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';

@Component({
  selector: 'pry-metadata-condition',
  templateUrl: './metadata-condition.component.html'
})
export class MetadataConditionComponent {
  @Input() readonly = false;

  @Input()
  set id(val: string) {
    this._id = val;
    this.assignObservables();
  }

  private _id?: string;
  metadata$: Observable<IMetadata | undefined> = of(undefined);
  condition$: Observable<NormalizedCondition | null> = of(null);
  deleteConditionOpen = false;
  metadataUsers$: Observable<IMetadata[]>;
  metadataUserOpen = false;

  operators$ = of([
    { operator: 'EQUALS', translation: '@pry.search.operator.equalsString' },
    { operator: 'NOT_EQUALS', translation: '@pry.search.operator.notEqualsString' }
  ]);

  constructor(private store: Store<any>) {
    this.metadataUsers$ = this.store.select(AdminMetadataUserSelectors.metadata);
  }

  private assignObservables(): void {
    this.condition$ = this.store.select(AbacRulesSelectors.editAbacRuleConditionsById(this._id ?? ''));
    this.metadata$ = this.condition$.pipe(
      filter((cond): cond is NormalizedCondition => cond !== null && cond !== undefined),
      switchMap((cond: NormalizedCondition) =>
        this.store.select(MetadataSelectors.selectMetadataById(cond.metadata ?? ''))
      )
    );
  }

  onChangeOperator(operator: OperatorType, conditionId: string) {
    this.store.dispatch(
      AbacRulesActions.updateEditAbacRuleConditionProperty({
        conditionId,
        property: { type: 'operator', value: operator }
      })
    );
  }

  onChangeValue(evt: any, conditionId: string): void {
    this.store.dispatch(
      AbacRulesActions.updateEditAbacRuleConditionProperty({
        conditionId,
        property: { type: 'value', value: evt.target.value }
      })
    );
  }

  onSelectMetadataUser(conditionId: string, metadata: IMetadata) {
    this.metadataUserOpen = false;
    const value = `\${user.metadata('${metadata.name}')}`;
    this.store.dispatch(
      AbacRulesActions.updateEditAbacRuleConditionProperty({
        conditionId,
        property: { type: 'value', value }
      })
    );
  }

  onDeleteMetadataCondition(conditionId: string, parentId: string): void {
    this.deleteConditionOpen = false;
    this.store.dispatch(
      AbacRulesActions.removeEditAbacRuleConditionFromComposed({ conditionId: parentId, childrenId: conditionId })
    );
  }
}
