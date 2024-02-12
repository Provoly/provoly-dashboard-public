import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassActions,
  ClassSelectors,
  ConfigActions,
  ConfigSelectors,
  Field,
  FieldActions,
  FieldSelectors,
  ItemUtils,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { combineLatest, combineLatestWith, map, Observable, of, switchMap } from 'rxjs';
import { AdminClassActions } from '../store/admin-class.actions';
import { AdminClassSelectors } from '../store/admin-class.selectors';

@Component({
  selector: 'pry-admin-classes-customize',
  templateUrl: './admin-classes-customize.component.html'
})
export class AdminClassesCustomizeComponent extends SubscriptionnerDirective implements OnDestroy {
  currentClass$: Observable<Class | undefined>;
  currentClass: Class = {} as Class;
  defaultAttributes: string[] = [];
  otherAttributes: string[] = [];
  currentPropertiesConfig$: Observable<string[]>;
  currentTilePropertiesConfig$: Observable<string[]>;
  classes$: Observable<Class[]> = of([]);
  defaultTileAttributes: string[] = [];
  otherTileAttributes: string[] = [];
  maxTilesAttributes = 5;
  fields$: Observable<Field[]>;

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    super();
    this.subscriptions.add(
      this.route.params.subscribe((params) =>
        this.store.dispatch(AdminClassActions.selectClass({ clazz: { id: params['id'] } as Class }))
      )
    );
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(ConfigActions.loadCustomization());
    this.fields$ = this.store.select(FieldSelectors.fields);
    this.currentClass$ = combineLatest([
      this.store.select(AdminClassSelectors.selectedClass),
      this.store.select(ClassSelectors.classes)
    ]).pipe(switchMap(([clazz, _]) => this.store.select(ClassSelectors.classById(clazz?.id ?? ''))));
    this.subscriptions.add(this.currentClass$.subscribe((clazz) => (this.currentClass = clazz ?? ({} as Class))));
    this.currentPropertiesConfig$ = this.store.select(ConfigSelectors.tableDefaultAttributesDefinitions).pipe(
      combineLatestWith(this.currentClass$, this.fields$),
      map(([defs, clazz, fields]) =>
        ItemUtils.getAttributesDefinitionForClass((clazz ?? { attributes: [] }) as Class, defs, fields)
      )
    );
    this.subscriptions.add(
      this.currentPropertiesConfig$.pipe(combineLatestWith(this.currentClass$)).subscribe(([attrs, clazz]) => {
        this.defaultAttributes = JSON.parse(JSON.stringify(attrs));
        this.otherAttributes = (clazz ?? { attributes: [] }).attributes
          .filter((attr) => !attrs.includes(attr.name))
          .map((attr) => attr.name);
      })
    );
    this.currentTilePropertiesConfig$ = this.store.select(ConfigSelectors.tileAttributesDefinitions).pipe(
      combineLatestWith(this.currentClass$, this.fields$),
      map(([defs, clazz, fields]) =>
        ItemUtils.getAttributesDefinitionForClass((clazz ?? { attributes: [] }) as Class, defs, fields)
      ),
      map((attrs) => attrs.filter((_, i) => i < this.maxTilesAttributes))
    );
    this.subscriptions.add(
      this.currentTilePropertiesConfig$.pipe(combineLatestWith(this.currentClass$)).subscribe(([attrs, clazz]) => {
        this.defaultTileAttributes = JSON.parse(JSON.stringify(attrs));
        this.otherTileAttributes = (clazz ?? { attributes: [] }).attributes
          .filter((attr) => !attrs.includes(attr.name))
          .map((attr) => attr.name);
      })
    );
    this.subscriptions.add(
      this.store.select(ConfigSelectors.maxAttributesInTiles).subscribe((max) => {
        this.maxTilesAttributes = max;
      })
    );
  }

  goBack() {
    const path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
    this.store.dispatch(AdminClassActions.back({ path: path.toString() }));
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    const toSort = event.previousContainer.id === 'cdk-drop-list-1' ? event.previousContainer : event.container;
    toSort.data.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }

  updateTableAttrs() {
    this.store.dispatch(
      ConfigActions.saveTableDefaultAttributes({
        definitions: { [this.currentClass.id]: this.defaultAttributes.sort() }
      })
    );
    this.goBack();
  }

  updateTileAttrs() {
    this.store.dispatch(
      ConfigActions.saveTileAttributes({
        definitions: { [this.currentClass.id]: this.defaultTileAttributes }
      })
    );
    this.goBack();
  }

  isTileConfValid() {
    return this.defaultTileAttributes.length > 0 && this.defaultTileAttributes.length <= this.maxTilesAttributes;
  }
}
