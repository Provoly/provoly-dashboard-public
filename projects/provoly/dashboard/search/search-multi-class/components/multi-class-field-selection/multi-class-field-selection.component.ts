import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassSelectors,
  Field,
  FieldSelectors,
  FieldType,
  MultiClassCondition,
  MultiClassFieldSelection
} from '@provoly/dashboard';
import { combineLatest, map, Observable } from 'rxjs';
import { SearchMultiClassSelectors } from '../../store/search-multi-class.selectors';
import { SearchMultiClassService } from '../../store/search-multi-class.service';

@Component({
  selector: 'pry-multi-class-field-selection',
  templateUrl: './multi-class-field-selection.component.html'
})
export class MultiClassFieldSelectionComponent {
  fields$: Observable<Field[]>;
  classes$: Observable<Class[]>;
  conditions$: Observable<MultiClassCondition[]>;
  availableFields$: Observable<MultiClassFieldSelection[]>;

  fieldSearch = '';

  @Input() set conditionId(val: string | undefined) {
    this._conditionId = val;
    this.availableFields$ = combineLatest([this.conditions$, this.classes$, this.fields$]).pipe(
      map(([conditions, classes, fields]) => this.sortFields(conditions, classes, fields)),
      map((fields) => {
        const uniqueFields = fields.map((field) => ({
          ...field,
          classes: [...new Set(field.classes)]
        }));
        return uniqueFields;
      })
    );
  }

  get conditionId(): any {
    return this._conditionId;
  }

  private _conditionId?: string;

  @Output() closeModal = new EventEmitter();
  @Output() selectFieldChange = new EventEmitter<string>();

  constructor(
    private store: Store<any>,
    private searchMultiClassService: SearchMultiClassService
  ) {
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.fields$ = this.store
      .select(FieldSelectors.fields)
      .pipe(map((fields) => fields.filter((field) => field.type !== FieldType.RAW)));
    this.conditions$ = this.store.select(SearchMultiClassSelectors.conditions);
    this.availableFields$ = combineLatest([this.conditions$, this.classes$, this.fields$]).pipe(
      map(([conditions, classes, fields]) => this.sortFields(conditions, classes, fields)),
      map((fields) => {
        const uniqueFields = fields.map((field) => ({
          ...field,
          classes: [...new Set(field.classes)]
        }));
        return uniqueFields;
      })
    );
  }

  private sortFields(conditions: MultiClassCondition[], classes: Class[], fields: Field[]): MultiClassFieldSelection[] {
    const availableFields = this.searchMultiClassService.getFieldsAvailable(
      conditions,
      classes,
      fields,
      this._conditionId
    );
    return availableFields.sort((a, b) => a.name.localeCompare(b.name));
  }
}
