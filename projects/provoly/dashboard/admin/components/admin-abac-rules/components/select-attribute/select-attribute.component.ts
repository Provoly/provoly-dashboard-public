import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Class, ClassSelectors } from '@provoly/dashboard';
import { combineLatest, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';

@Component({
  selector: 'pry-abac-select-attribute',
  templateUrl: './select-attribute.component.html'
})
export class SelectAttributeComponent {
  @Output() attributeSelected = new EventEmitter<{ attribute: string; class: string }>();
  classes$: Observable<Class[]>;

  constructor(private store: Store<any>) {
    const classSelected$ = this.store
      .select(AbacRulesSelectors.editAbacRuleConditionsFirstAttribute)
      .pipe(switchMap((attribute) => this.store.select(ClassSelectors.classByAttributeId(attribute ?? ''))));
    this.classes$ = this.store.select(ClassSelectors.classes).pipe(
      mergeMap((classes) => combineLatest([of(classes), classSelected$])),
      map(([classes, clazz]) => (clazz ? classes.filter((c) => c.id === clazz.id) : classes))
    );
  }

  onSelectAttribute(classId: string, attributeId: string): void {
    this.attributeSelected.emit({ attribute: attributeId, class: classId });
  }
}
