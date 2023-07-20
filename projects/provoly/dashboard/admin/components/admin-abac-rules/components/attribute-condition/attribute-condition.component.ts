import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Attribute, Class, ClassSelectors, Field, FieldSelectors, FieldType, IMetadata } from '@provoly/dashboard';
import { combineLatest, filter, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { AbacRulesActions } from '../../store/abac-rules.actions';
import { NormalizedCondition, OPERATOR_OPTIONS, OperatorOption, OperatorType } from '../../store/abac-rules.model';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';

@Component({
  selector: 'pry-attribute-condition',
  templateUrl: './attribute-condition.component.html'
})
export class AttributeConditionComponent {
  panelOpen = false;
  @Input() readonly = false;

  @Input()
  set id(val: string) {
    this._id = val;
    this.assignObservables();
  }

  private _id?: string;
  field$: Observable<Field | null> = of(null);
  attribute$: Observable<Attribute | undefined> = of(undefined);
  metadata$: Observable<IMetadata | undefined> = of(undefined);
  condition$: Observable<NormalizedCondition | null> = of(null);
  operatorOptions$: Observable<OperatorOption[]> = of([]);

  constructor(private store: Store<any>) {}

  private assignObservables(): void {
    this.condition$ = this.store.select(AbacRulesSelectors.editAbacRuleConditionsById(this._id ?? ''));
    this.attribute$ = this.condition$.pipe(
      filter((cond): cond is NormalizedCondition => cond !== null && cond !== undefined),
      mergeMap((cond) =>
        combineLatest([of(cond), this.store.select(ClassSelectors.classByAttributeId(cond.attribute ?? ''))])
      ),
      map(([cond, klass]) => {
        return (klass as Class)?.attributes.find((a) => a.id === cond.attribute);
      })
    );
    this.field$ = this.attribute$.pipe(
      filter((attr): attr is Attribute => attr !== undefined),
      switchMap((attr) => {
        return this.store.select(FieldSelectors.fieldById(attr.field));
      })
    );

    this.operatorOptions$ = this.field$.pipe(
      filter((field): field is Field => field !== undefined),
      map((field: Field) => {
        const fieldType = field.type;
        if (fieldType === FieldType.STRING || fieldType === FieldType.KEYWORD) {
          return OPERATOR_OPTIONS.filter((el) => el.type === 'string');
        } else if (fieldType === FieldType.INTEGER || fieldType === FieldType.DECIMAL || fieldType === FieldType.LONG) {
          return OPERATOR_OPTIONS.filter((el) => el.type === 'number');
        } else {
          return OPERATOR_OPTIONS.filter((el) => el.type === 'date');
        }
      })
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

  onOpenPanel(): void {
    this.panelOpen = true;
  }

  onClosePanel(): void {
    this.panelOpen = false;
  }

  onDeleteAttributeCondition(conditionId: string, parentId: string): void {
    this.store.dispatch(
      AbacRulesActions.removeEditAbacRuleConditionFromComposed({ conditionId: parentId, childrenId: conditionId })
    );
  }
}
