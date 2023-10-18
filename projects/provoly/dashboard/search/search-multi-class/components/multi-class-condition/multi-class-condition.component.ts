import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassSelectors,
  ConfigActions,
  Field,
  FieldSelectors,
  FieldType,
  MultiClassCondition,
  OPERATOR_OPTIONS,
  OperatorOption
} from '@provoly/dashboard';
import { combineLatest, filter, map, Observable, of, switchMap, take } from 'rxjs';
import { SearchMultiClassActions } from '../../store/search-multi-class.actions';
import { SearchMultiClassSelectors } from '../../store/search-multi-class.selectors';
import { SearchMultiClassService } from '../../store/search-multi-class.service';

@Component({
  selector: 'pry-multi-class-condition',
  templateUrl: './multi-class-condition.component.html'
})
export class MultiClassConditionComponent implements OnInit {
  @ViewChild('fieldSelectionTpl', { read: TemplateRef }) fieldSelectionTpl!: TemplateRef<any>;
  condition$: Observable<MultiClassCondition | undefined> = of(undefined);
  classesLinked$: Observable<Class[]> = of([]);
  field$: Observable<Field | undefined> = of(undefined);
  classes$: Observable<Class[]>;
  conditions$: Observable<MultiClassCondition[]>;
  notLastCondition$: Observable<boolean>;
  operators$: Observable<OperatorOption[]> = of([]);

  @Input() set id(val: string) {
    this._id = val;
    this.condition$ = this.store.select(SearchMultiClassSelectors.getConditionById(this._id));
    this.condition$
      .pipe(
        filter((c): c is MultiClassCondition => c?.field !== undefined),
        take(1)
      )
      .subscribe((c) => {
        if (c.isDate && typeof this.form.get('value')?.value !== 'string') {
          this.form.patchValue({ operator: c.operator, value: { start: c.value, end: c.upperValue } });
        } else {
          this.form.patchValue(
            { operator: c.operator, value: c.value, upperValue: c.upperValue },
            { emitEvent: false }
          );
        }

        this.formValue?.setValidators([Validators.required]);
        this.formValue?.updateValueAndValidity();
        if (c.value !== null) {
          this.form.markAllAsTouched();
        }
        this.form.enable({ emitEvent: false });
      });
    this.field$ = this.condition$.pipe(
      filter((c): c is MultiClassCondition => c !== undefined),
      switchMap((c) => this.store.select(FieldSelectors.fieldById(c.field)))
    );
    this.classesLinked$ = combineLatest([this.conditions$, this.condition$, this.classes$]).pipe(
      map(([conditions, condition, classes]) => this.service.getClassesForField(conditions, condition, classes)),
      filter((clazz) => (clazz?.length ?? 0) > 0)
    );
    this.operators$ = this.condition$.pipe(
      filter((c): c is MultiClassCondition => c !== undefined),
      switchMap((c) => this.store.select(FieldSelectors.fieldById(c.field))),
      filter((f): f is Field => f !== undefined),
      map((f) => {
        const type = f.type;
        if ([FieldType.STRING, FieldType.KEYWORD].includes(type)) {
          return OPERATOR_OPTIONS.filter((opt) => opt.type === 'string');
        } else if ([FieldType.DECIMAL, FieldType.INTEGER, FieldType.LONG].includes(type)) {
          return OPERATOR_OPTIONS.filter((opt) => opt.type === 'number');
        } else {
          return OPERATOR_OPTIONS.filter((opt) => opt.type === 'date');
        }
      })
    );
  }

  private _id?: string;
  opened = false;
  private overlayRef?: OverlayRef;

  form = new UntypedFormGroup({
    operator: new UntypedFormControl({ value: null, disabled: true }, [Validators.required]),
    value: new UntypedFormControl({ value: null, disabled: true }, [Validators.required]),
    upperValue: new UntypedFormControl({ value: null, disabled: true }, [])
  });

  get formValue(): AbstractControl | null {
    return this.form.get('value');
  }

  constructor(
    private store: Store<any>,
    private service: SearchMultiClassService,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.conditions$ = this.store.select(SearchMultiClassSelectors.conditions);
    this.notLastCondition$ = this.conditions$.pipe(map((conditions) => (conditions?.length ?? 0) !== 1));
  }

  public ngOnInit(): void {
    this.form.get('operator')?.valueChanges.subscribe((value) => {
      if (this._id) {
        this.store.dispatch(SearchMultiClassActions.updateCondition({ conditionId: this._id, key: 'operator', value }));
      }
    });
  }

  onRemoveCondition(condition: MultiClassCondition): void {
    this.store.dispatch(SearchMultiClassActions.removeCondition({ conditionId: condition.id }));
  }

  toggleFieldSelection() {
    this.opened = !this.opened;
    if (this.opened) {
      this.openWithTemplate();
    } else {
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.overlayRef?.dispose();
    }
  }

  openWithTemplate() {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        backdropClass: 'backdrop',
        positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
        minHeight: '300px',
        maxHeight: '600px',
        width: '500px'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.backdropClick().subscribe((_) => this.toggleFieldSelection());
    this.overlayRef.attach(new TemplatePortal(this.fieldSelectionTpl, this.viewContainerRef));
  }

  onChangeField(condition: MultiClassCondition, field: string) {
    if (condition.field !== field) {
      this.store.dispatch(SearchMultiClassActions.updateConditionField({ conditionId: condition.id, field }));
    }
    this.toggleFieldSelection();
  }

  onCloseModal() {
    this.toggleFieldSelection();
  }

  onUpdateValue(condition: MultiClassCondition) {
    let formValue, formSecondValue;
    if (condition.isDate && typeof this.form.get('value')?.value !== 'string') {
      formValue = this.form.get('value')?.value.start;
      formSecondValue = this.form.get('value')?.value.end;
    } else {
      formValue = this.form.get('value')?.value;
      formSecondValue = this.form.get('upperValue')?.value;
    }

    if (formValue !== condition.value || formSecondValue !== condition.upperValue) {
      this.store.dispatch(
        SearchMultiClassActions.updateCondition({
          conditionId: condition.id,
          key: 'value',
          value: formValue,
          upperValue: formSecondValue
        })
      );
    }
  }

  join(classes: Class[]): string {
    return classes.map((clazz) => clazz.name).join(', ');
  }

  get hasTwoFields() {
    return this.form.get('operator')?.value === 'INSIDE' || this.form.get('operator')?.value === 'OUTSIDE';
  }
}
