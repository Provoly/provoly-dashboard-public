import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Class,
  ClassSelectors,
  Field,
  FieldSelectors,
  FieldType,
  OrderValue,
  PryI18nService,
  ResultOrder
} from '@provoly/dashboard';
import equal from 'fast-deep-equal/es6';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, withLatestFrom } from 'rxjs/operators';
import { SearchMonoClassActions } from '../../store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';

@Component({
  selector: 'pry-search-order',
  templateUrl: './search-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrySearchOrderComponent implements AfterViewInit {
  @HostBinding('class') class = 'o-pry-search-order-wrapper';
  @HostBinding('class.is-hover') hover = false;
  masterId$: Observable<string | null>;
  monoClassId$: Observable<string | undefined>;
  classes$: Observable<Class[]>;
  variableAttributes$: Observable<Attribute[]>;
  order$: Observable<ResultOrder | undefined>;
  fields$: Observable<Field[]>;
  private activated = false;

  @HostListener('mouseover', ['$event'])
  onMouseOver(evt: any) {
    evt.stopPropagation();
    this.hover = true;
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut(evt: any) {
    evt.stopPropagation();
    this.hover = false;
  }

  constructor(
    private store: Store<any>,
    private translateService: PryI18nService
  ) {
    this.masterId$ = this.store.select(SearchMonoClassSelectors.selectMonoClassConditionsMasterId);
    this.monoClassId$ = this.store.select(SearchMonoClassSelectors.selectMonoClassIdSearch);
    this.order$ = this.store.select(SearchMonoClassSelectors.order);
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.fields$ = this.store.select(FieldSelectors.fields);

    this.variableAttributes$ = combineLatest([this.monoClassId$, this.classes$]).pipe(
      map(([classId, classes]) => classes.find((clazz) => clazz.id === classId)?.attributes ?? []),
      map((attrs) => attrs.filter((attr) => attr.field.type !== FieldType.RAW)),
      map((attrs) =>
        attrs.concat({
          name: this.translateService.instant('@pry.search.composed.orderNone'),
          id: 'null'
        } as unknown as Attribute)
      ),
      distinctUntilChanged((p, c) => equal(p, c))
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.activated = true;
    }, 100);
  }

  changeProperty(_attribute?: string, asc?: OrderValue) {
    if (this.activated) {
      const attribute = _attribute === 'null' ? undefined : _attribute;
      this.store.dispatch(
        SearchMonoClassActions.addOrder({ attribute: attribute, asc: asc ?? (attribute ? 'asc' : undefined) })
      );
    }
  }
}
