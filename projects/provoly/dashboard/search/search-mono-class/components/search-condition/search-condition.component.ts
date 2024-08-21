import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Class,
  ClassSelectors,
  DateRange,
  FieldType,
  NormalizedCondition,
  OPERATOR_OPTIONS,
  OperatorOption,
  OperatorType
} from '@provoly/dashboard';
import { combineLatest, filter, map, Observable, Subject, Subscription, switchMap, tap } from 'rxjs';
import { SearchMonoClassActions } from '../../store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';

@Component({
  selector: 'pry-search-condition',
  templateUrl: './search-condition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrySearchConditionComponent implements OnDestroy {
  @HostBinding('class') class = 'o-pry-search-condition-wrapper';

  @Input() set attributeId(val: string) {
    this.attributeId$.next(val);
    this.attributeName$ = this.store.select(SearchMonoClassSelectors.selectMonoClassIdSearch).pipe(
      filter((id): id is string => id !== null),
      switchMap((id) => this.store.select(ClassSelectors.classById(id))),
      filter((clazz): clazz is Class => clazz !== undefined),
      map((clazz: Class) => clazz.attributes.find((c) => c.id === val)?.name ?? '')
    );
  }

  @Input() set id(val: string) {
    this.conditionId$.next(val);
    this.conditionId = val;
  }

  @Input() set useTextDateInputs(val: boolean) {
    this.textDateInputs = val;
  }

  private attributeId$ = new Subject<string>();
  private conditionId$ = new Subject<string>();
  private conditionId!: string;
  attributeName$?: Observable<string>;
  operatorOptions$!: Observable<OperatorOption[]>;
  condition$!: Observable<NormalizedCondition>;

  pattern?: string;
  isDate = false;
  firstValueInvalid = false;
  secondValueInvalid = false;
  conditionValue = '';
  secondConditionValue = '';
  twoValues = false;
  operatorSelectedValue?: OperatorType;
  textDateInputs = false;
  dateConditionValue: string | DateRange = '';

  private sub = new Subscription();

  constructor(
    private store: Store<any>,
    private _detect: ChangeDetectorRef
  ) {
    this.sub.add(
      combineLatest([this.attributeId$, this.conditionId$])
        .pipe(
          filter(([attributeId, conditionId]) => attributeId !== null && conditionId !== null),
          tap(([attributeId, conditionId]) => {
            this.assignOperatorOption$(attributeId);
            this.assignCondition$(conditionId);
          }),
          switchMap(() => combineLatest([this.operatorOptions$, this.condition$]))
        )
        .subscribe(([operatorOptions, condition]) => {
          if (condition) {
            this.conditionValue = condition.value?.toString() ?? '';
            const operator = operatorOptions.find((ope) => ope.operator === condition.operator);
            if (operator) {
              this.operatorSelectedValue = operator.operator;
              this.twoValues = operator.twoValues;
            }
            this.pattern = condition.pattern;
            this.isDate = condition.isDate ?? false;
            this._detect.markForCheck();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSelectedOperator(operatorType: OperatorType): void {
    this.store.dispatch(
      SearchMonoClassActions.updateNormalizedConditionOperatorForConditionId({
        conditionId: this.conditionId,
        operator: operatorType
      })
    );
  }

  updateFirstValue(): void {
    this.store.dispatch(
      SearchMonoClassActions.updateNormalizedConditionValueForConditionId({
        value: this.conditionValue,
        conditionId: this.conditionId
      })
    );
  }

  onCheckValidity(evt: any, first: boolean) {
    if (this.pattern && evt?.target?.value) {
      if (first) {
        this.firstValueInvalid = !RegExp(this.pattern).test(evt.target.value);
      } else {
        this.secondValueInvalid = !RegExp(this.pattern).test(evt.target.value);
      }
      this._detect.markForCheck();
    }
  }

  onDeleteAttributeCondition(): void {
    this.store.dispatch(SearchMonoClassActions.deleteNormalizedConditionById({ conditionId: this.conditionId }));
  }

  updateSecondValue(): void {
    this.store.dispatch(
      SearchMonoClassActions.updateNormalizedConditionValueForConditionId({
        value: this.conditionValue,
        conditionId: this.conditionId,
        upperValue: this.secondConditionValue
      })
    );
  }

  updateDateCondition(): void {
    this.store.dispatch(
      SearchMonoClassActions.updateNormalizedConditionValueForConditionId({
        value: typeof this.dateConditionValue == 'object' ? this.dateConditionValue.start : this.dateConditionValue,
        conditionId: this.conditionId,
        upperValue: typeof this.dateConditionValue == 'object' ? this.dateConditionValue.end : ''
      })
    );
  }

  private assignOperatorOption$(attributeId: string): void {
    this.operatorOptions$ = this.store
      .select(SearchMonoClassSelectors.selectMonoClassSearchAttributeById(attributeId))
      .pipe(
        filter((attr): attr is Attribute => attr !== undefined),
        map((attr: Attribute) => {
          const fieldType = attr.field.type;
          if (fieldType === FieldType.STRING || fieldType === FieldType.KEYWORD) {
            return OPERATOR_OPTIONS.filter((el) => el.type === 'string');
          } else if (
            fieldType === FieldType.INTEGER ||
            fieldType === FieldType.DECIMAL ||
            fieldType === FieldType.LONG
          ) {
            return OPERATOR_OPTIONS.filter((el) => el.type === 'number');
          } else {
            return OPERATOR_OPTIONS.filter((el) => el.type === 'date');
          }
        })
      );
  }

  private assignCondition$(conditionId: string): void {
    this.condition$ = this.store
      .select(SearchMonoClassSelectors.selectMonoClassConditionsById(conditionId))
      .pipe(filter((cond): cond is NormalizedCondition => cond !== null));
  }
}
