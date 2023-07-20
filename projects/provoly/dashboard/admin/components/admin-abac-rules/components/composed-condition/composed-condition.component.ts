import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AbacRulesActions } from '../../store/abac-rules.actions';
import { AbacRuleType, ConditionType, NormalizedCondition } from '../../store/abac-rules.model';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';

@Component({
  selector: 'pry-composed-condition',
  templateUrl: './composed-condition.component.html'
})
export class ComposedConditionComponent {
  readonly AND: ConditionType = 'AND';
  readonly OR: ConditionType = 'OR';
  readonly ATTRIBUTE: ConditionType = 'ATTRIBUTE';
  readonly METADATA: ConditionType = 'METADATA';

  editAbacRuleType$: Observable<AbacRuleType | undefined>;

  @Input() set id(val: string) {
    this._id = val;
    this.condition$ = this.store.select(AbacRulesSelectors.editAbacRuleConditionsById(this._id));
  }

  private _id!: string;
  condition$: Observable<NormalizedCondition | null> = of(null);

  @Input() readonly = false;
  @Input() rootElement = false;

  panelOpen = false;

  isDisabled: boolean = false;

  constructor(private store: Store<any>) {
    this.editAbacRuleType$ = this.store.select(AbacRulesSelectors.editAbacRuleType);
  }

  onAddNewAttribute(evt: { attribute: string; class: string }, conditionId: string): void {
    this.panelOpen = false;
    this.store.dispatch(
      AbacRulesActions.createEditAbacRuleAttributeCondition({
        attributeId: evt.attribute,
        classId: evt.class,
        parentId: conditionId
      })
    );
  }

  onAddNewMetadata(id: string, conditionId: string): void {
    this.panelOpen = false;
    this.store.dispatch(
      AbacRulesActions.createEditAbacRuleMetadataCondition({ metadataId: id, parentId: conditionId })
    );
  }

  onAddNewNestedCondition(conditionId: string): void {
    this.store.dispatch(AbacRulesActions.createEditAbacRuleNestedCondition({ parentId: conditionId }));
  }

  onChangeConditionType(conditionType: ConditionType, conditionId: string): void {
    this.store.dispatch(
      AbacRulesActions.updateEditAbacRuleConditionProperty({
        conditionId,
        property: { type: 'type', value: conditionType }
      })
    );
  }
}
