import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Class,
  compareOperationFunctions,
  ConfigActions,
  ConfigSelectors,
  DEFAULT_ICON_URL,
  IconDefinitions,
  IconOptions,
  IconPosition,
  PryI18nService,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import equal from 'fast-deep-equal/es6';
import { distinctUntilChanged } from 'rxjs/operators';

const DEFAULT_RULE = {
  isDefault: true,
  iconUrl: DEFAULT_ICON_URL,
  iconSize: [25, 25]
};

@Component({
  selector: 'pry-admin-classes-customize-symbol',
  templateUrl: './admin-classes-customize-symbol.component.html'
})
export class AdminClassesCustomizeSymbolComponent extends SubscriptionnerDirective implements OnDestroy {
  @Output() backPressed = new EventEmitter<void>();
  private _currentClass: Class = {} as Class;
  definitions: IconOptions[] = [];
  initialDefinitions?: IconOptions[] = undefined;
  baseDefs: IconDefinitions = {};
  positions = Object.values(IconPosition).map((pos) => ({
    label: '@pry.admin.position.' + pos,
    value: pos
  }));
  fieldsForClass: Attribute[] = [];
  operations = Object.keys(compareOperationFunctions).map((op) => ({
    label: '@pry.admin.classes.operations.' + op,
    name: op
  }));
  sizes = [25, 50, 100].map((size) => ({
    label: `${size}x${size}`,
    value: size
  }));

  @Input() set currentClass(clazz: Class | null | undefined) {
    this._currentClass = clazz ?? ({} as Class);
    this.definitions = !!this.baseDefs
      ? JSON.parse(JSON.stringify(this.baseDefs[clazz?.id ?? ''] ?? [DEFAULT_RULE]))
      : [];
    this.definitions.sort((def1, def2) => (def1.isDefault ? -1 : 1) - (def2.isDefault ? -1 : 1));
    if (!this.initialDefinitions && !!this.baseDefs) {
      this.initialDefinitions = JSON.parse(JSON.stringify(this.definitions));
    }
    this.fieldsForClass = [...(clazz ?? { attributes: [] }).attributes].sort((attr1, attr2) =>
      attr1.name.localeCompare(attr2.name)
    );
  }

  get currentClass() {
    return this._currentClass;
  }

  constructor(
    private translateService: PryI18nService,
    private store: Store
  ) {
    super();
    this.subscriptions.add(
      this.store
        .select(ConfigSelectors.iconDefinitions)
        .pipe(distinctUntilChanged((a, b) => equal(a, b)))
        .subscribe((defs) => {
          this.baseDefs = defs;
          this.definitions = !!defs
            ? JSON.parse(JSON.stringify(defs[this.currentClass?.id ?? ''] ?? [DEFAULT_RULE]))
            : [];
          this.definitions.sort((def1, def2) => (def1.isDefault ? -1 : 1) - (def2.isDefault ? -1 : 1));
          if (!this.initialDefinitions && !!defs) {
            this.initialDefinitions = JSON.parse(JSON.stringify(this.definitions));
          }
        })
    );
  }

  changeForImage(icon: string, i: number) {
    this.definitions[i].iconUrl = icon;
    this.store.dispatch(
      ConfigActions.updateIcons({ definitions: { [this.currentClass?.id ?? '']: this.definitions } })
    );
  }

  changePosition($event: any, i: number) {
    this.definitions[i].position = $event;
  }

  changeAttrName($event: any, i: number) {
    // @ts-ignore
    this.definitions[i].rule.attributeName = $event;
  }

  changeValue($event: any, i: number) {
    // @ts-ignore
    this.definitions[i].rule.value = $event;
  }

  changeOperation($event: any, i: number) {
    // @ts-ignore
    this.definitions[i].rule.operation = $event;
  }

  toggleRule(i: number) {
    if (!this.definitions[i].rule) {
      this.definitions[i].rule = { attributeName: '', value: '', operation: 'EQUALS' };
    } else {
      this.definitions[i].rule = undefined;
    }
    this.store.dispatch(
      ConfigActions.updateIcons({ definitions: { [this.currentClass?.id ?? '']: this.definitions } })
    );
  }

  goBack() {
    this.backPressed.emit();
  }

  changeIcon(i: number, $event: string) {
    this.definitions[i].iconUrl = $event;
  }

  changeSize($event: number) {
    const defaultRule = this.definitions.find((def) => def.isDefault);
    if (defaultRule) {
      defaultRule.iconSize = [$event, $event];
    }
  }

  valid() {
    this.store.dispatch(ConfigActions.saveIcons({ definitions: { [this.currentClass?.id ?? '']: this.definitions } }));
    this.initialDefinitions = JSON.parse(JSON.stringify(this.definitions));
    this.goBack();
  }

  addRule() {
    this.definitions.push({ iconUrl: DEFAULT_ICON_URL, iconSize: [25, 25] });
    this.store.dispatch(
      ConfigActions.updateIcons({ definitions: { [this.currentClass?.id ?? '']: this.definitions } })
    );
  }

  removeRule(i: number) {
    this.definitions.splice(i, 1);
    this.store.dispatch(
      ConfigActions.updateIcons({ definitions: { [this.currentClass?.id ?? '']: this.definitions } })
    );
  }

  restoreSymbols() {
    this.store.dispatch(
      ConfigActions.updateIcons({
        definitions: { [this.currentClass?.id ?? '']: this.initialDefinitions ?? this.definitions }
      })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.restoreSymbols();
  }

  move(index: number, nextIndex: number) {
    const tmp = this.definitions[index];
    this.definitions[index] = this.definitions[nextIndex];
    this.definitions[nextIndex] = tmp;
    this.store.dispatch(
      ConfigActions.updateIcons({ definitions: { [this.currentClass?.id ?? '']: this.definitions } })
    );
  }
}
