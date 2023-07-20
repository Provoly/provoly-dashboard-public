import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Attribute, Class, ClassSelectors, FieldSelectors, FieldType } from '@provoly/dashboard';
import { filter, map, Observable, switchMap } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';

@Component({
  selector: 'pry-search-select-attribute',
  templateUrl: './search-select-attribute.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrySearchSelectAttributeComponent {
  @Input() set id(val: string) {
    this._attributes$ = this.store.select(SearchMonoClassSelectors.selectMonoClassIdSearch).pipe(
      filter((id): id is string => id !== null),
      switchMap((id) => this.store.select(ClassSelectors.classById(id))),
      filter((clazz): clazz is Class => clazz !== undefined),
      withLatestFrom(this.store.select(FieldSelectors.fields)),
      map(([clazz, fields]) => {
        const attributes = [...(clazz.attributes ?? [])].filter(
          (attr) => fields.find((field) => field.id === attr.field)?.type !== FieldType.RAW
        );
        return attributes.sort((a, b) => a.name.localeCompare(b.name));
      })
    );
  }

  @Output() selectAttributeChange = new EventEmitter<Attribute>();

  get attributes$(): Observable<Attribute[]> | undefined {
    return this._attributes$;
  }

  _attributes$?: Observable<Attribute[]>;

  constructor(private store: Store<any>) {}

  onSelectAttribute(attribute: Attribute): void {
    this.selectAttributeChange.emit(attribute);
  }
}
