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
  ConfigActions,
  ConfigSelectors,
  Item,
  PryI18nService,
  SubscriptionnerDirective,
  TooltipFactoryService,
  TooltipOfClass
} from '@provoly/dashboard';
import { map, Observable } from 'rxjs';
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
  possibleAttributes: Attribute[] = [];
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
  private _currentClass: Class = {} as Class;
  private fields: Attribute[] = [];
  strOptions: string = '';
  tmpComponent?: ComponentRef<BaseTooltipComponent>;
  defs: { [p: string]: TooltipOfClass } = {};
  noTooltip: boolean = false;

  @Input() set currentClass(clazz: Class | null | undefined) {
    this._currentClass = clazz ?? ({} as Class);
    this.fields = (clazz ?? { attributes: [] }).attributes ?? [];
    this.possibleAttributes = this.possibleNonAttributesFields
      .concat(this.fields)
      .sort((f1, f2) => f1.name.localeCompare(f2.name));
    this.currentClassConfig = JSON.parse(JSON.stringify(this.defs[this.currentClass.id] ?? { type: 'default' }));
  }

  get currentClass(): Class {
    return this._currentClass;
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
  }

  tooltipTypeChanged($event: any) {
    this.currentClassConfig.type = $event;
    if (this.currentClassConfig.type === 'attribute') {
      this.currentClassConfig.options = { attributes: this.possibleAttributes.map((attr) => attr.id) };
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
        component.instance.data.item = this.fields
          .map((attr) => ({
            [attr.name]: {
              type: 'VALUE',
              value: '«' + this.translateService.instant('@pry.admin.customize.exemple', { expr: attr.name }) + '»',
              visible: true
            } as AttributeSimpleValue
          }))
          .reduce((p, c) => ({ ...p, attributes: { ...p.attributes, ...c } }), {
            oClass: this.currentClass.id,
            id: v4(),
            label: '«' + this.translateService.instant('@pry.admin.customize.exemple', { expr: 'label' }) + '»',
            attributes: {} as { [key: string]: AttributeSimpleValue }
          } as Item);

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
}
