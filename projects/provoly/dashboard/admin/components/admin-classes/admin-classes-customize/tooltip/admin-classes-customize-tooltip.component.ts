import {
  Component,
  ComponentRef,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  AttributeSimpleValue,
  BaseTooltipComponent,
  Class,
  ClassSelectors,
  ConfigActions,
  ConfigSelectors,
  Field,
  FieldSelectors,
  Item,
  PryI18nService,
  SubscriptionnerDirective,
  TooltipFactoryService,
  TooltipOfClass
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'pry-admin-classes-customize-tooltip',
  templateUrl: './admin-classes-customize-tooltip.component.html'
})
export class AdminClassesCustomizeTooltipComponent extends SubscriptionnerDirective implements OnDestroy {
  @ViewChild('example', { read: ViewContainerRef }) example!: ViewContainerRef;
  currentClassConfig: TooltipOfClass = { type: 'default' };
  possibleTooltipTypes$: Observable<{ value: string; label: string }[]>;
  advancedTooltip: boolean = false;
  possibleNonAttributesFields = [
    {
      name: 'id',
      id: 'id'
    },
    {
      name: 'oClass',
      id: 'oClass'
    }
  ] as Attribute[];
  @Output() backPressed = new EventEmitter<void>();
  private _currentClass$ = new BehaviorSubject<Class>({} as Class);
  strOptions: string = '';
  tmpComponent?: ComponentRef<BaseTooltipComponent>;
  defs: { [p: string]: TooltipOfClass } = {};
  noTooltip: boolean = false;
  classes$: Observable<Class[]>;
  fields$: Observable<Field[]>;
  attributesOfClass$: Observable<Attribute[]>;
  mockData: any;
  attributes: Attribute[] = [];

  @Input() set currentClass(clazz: Class | null | undefined) {
    this._currentClass$.next(clazz ?? ({} as Class));
    this.currentClassConfig = this.removeUnknown(
      JSON.parse(JSON.stringify(this.defs[this.currentClass.id] ?? { type: 'default' }))
    );
  }

  get currentClass(): Class {
    return this._currentClass$.value;
  }

  constructor(
    private tooltipFactoryService: TooltipFactoryService,
    private injector: Injector,
    private translateService: PryI18nService,
    private store: Store
  ) {
    super();
    this.possibleTooltipTypes$ = this.tooltipFactoryService.types$.pipe(
      map((types) =>
        types.map((type) => ({
          value: type,
          label: this.translateService.instant('@pry.tooltip.' + type)
        }))
      )
    );
    this.subscriptions.add(
      this.store.select(ConfigSelectors.tooltipDefinitions).subscribe((defs) => {
        this.defs = defs;
        this.currentClassConfig = JSON.parse(JSON.stringify(defs[this.currentClass.id] ?? { type: 'default' }));
      })
    );
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.fields$ = this.store.select(FieldSelectors.fields);
    this.attributesOfClass$ = combineLatest([this._currentClass$, this.classes$]).pipe(
      map(([clazz, classes]) => classes.find((cl) => cl.id === clazz.id)?.attributes ?? []),
      map((attrs) => [...attrs, ...this.possibleNonAttributesFields].sort((f1, f2) => f1.name.localeCompare(f2.name)))
    );
    this.subscriptions.add(
      this.attributesOfClass$.subscribe((attrs) => {
        this.attributes = attrs;
        this.mockData = attrs
          .map((attr) => ({
            [attr.technicalName]: {
              type: 'VALUE',
              value:
                '«' + this.translateService.instant('@pry.admin.customize.exemple', { expr: attr.technicalName }) + '»',
              visible: true
            } as AttributeSimpleValue
          }))
          .reduce((p, c) => ({ ...p, attributes: { ...p.attributes, ...c } }), {
            oClass: this.currentClass.id,
            id: v4(),
            label: '«' + this.translateService.instant('@pry.admin.customize.exemple', { expr: 'label' }) + '»',
            attributes: {} as { [key: string]: AttributeSimpleValue }
          } as Item);
      })
    );
  }

  tooltipTypeChanged($event: any) {
    this.currentClassConfig.type = $event;
    if (this.currentClassConfig.type === 'attribute') {
      this.currentClassConfig.options = { attributes: this.attributes.map((attr) => attr.id) };
    } else {
      this.currentClassConfig.options = {};
    }
    this.strOptions = JSON.stringify(this.currentClassConfig.options);
    this.updateExample();
  }

  optionsChanged() {
    this.currentClassConfig.options = JSON.parse(this.strOptions);
    if (this.tmpComponent) {
      this.tmpComponent.instance.context = this.currentClassConfig.options;
    }
    this.updateExample();
  }

  updateExample() {
    this.example?.clear();
    const component$ = this.tooltipFactoryService.generateTooltip(
      this.currentClassConfig.type,
      this.injector,
      this.example
    );
    component$.subscribe((component) => {
      this.noTooltip = !component;
      if (component) {
        component.instance.data.item = this.mockData;

        this.tmpComponent = component;

        component.instance.context = this.currentClassConfig.options;
      }
    });
  }

  updateTemplate() {
    this.store.dispatch(
      ConfigActions.saveTooltip({
        definitions: { [this.currentClass.id]: this.currentClassConfig }
      })
    );
    this.goBack();
  }

  goBack() {
    this.backPressed.emit();
  }

  changeAttributes($event: any) {
    this.currentClassConfig.options.attributes = $event;
    setTimeout(() => this.updateExample(), 100);
  }

  private removeUnknown(config: TooltipOfClass): TooltipOfClass {
    if (config.type === 'attribute') {
      const toRemove: string[] = [];
      config.options.attributes.forEach((attr: string) => {
        if (!this.attributes.map((attr) => attr.id).includes(attr)) {
          toRemove.push(attr);
        }
      });
      config.options.attributes = config.options.attributes.filter((attr: string) => !toRemove.includes(attr));
    }
    return config;
  }
}
