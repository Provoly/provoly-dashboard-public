import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Aggregation,
  Attribute,
  AttributeSimpleValue,
  ChartOption,
  ChartSubTypeDefinition,
  ChartWidgetOptions,
  Class,
  ClassSelectors,
  ConfigSelectors,
  DashboardSelectors,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  FieldType,
  Item,
  ItemUtils,
  MarkSubType,
  MarkType,
  PryI18nService,
  VariableDefinition,
  VegaColorType,
  VegaType,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import equal from 'fast-deep-equal/es6';
import { BehaviorSubject, combineLatest, delay, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { TimeUnit, View } from 'vega';
import embed, { vega } from 'vega-embed';
import { mergeDeep, TopLevelSpec } from 'vega-lite';
import { fontConfig } from 'vega-lite/build/src/config';
import { VegaErrorHandler } from './vega-error.handler';
import { vegaBaseConf, vegaCirclePackConf, vegaRadarConf } from './vega-spec.constant';

export type RadarValue = {
  category: number;
  key: string;
  value: number;
};

vega.scheme('KO/W/OK', ['#C04D3F', '#FD9843', '#9ABE29']);

@Component({
  selector: 'pry-widget-chart',
  templateUrl: './widget-chart.component.html'
})
export class WidgetChartComponent extends DataWidgetComponent implements AfterViewInit {
  @ViewChild('vega') vega!: ElementRef;
  typeOptions: {
    type: MarkType;
    subType: MarkSubType;
    label: MarkType | MarkSubType;
    id: string;
    translated?: string;
  }[] = [];
  markTypes: MarkType[] = [];
  subTypes?: Partial<ChartSubTypeDefinition>;
  schemes?: { id: VegaColorType; translated: string }[];
  MarkType = MarkType;
  MarkSubType = MarkSubType;
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;

  timeUnits: TimeUnit[] = ['year', 'quarter', 'month', 'week', 'day', 'hours', 'minutes'];
  options$: Observable<ChartWidgetOptions>;
  optionsCopy: ChartWidgetOptions = {} as ChartWidgetOptions;
  classes$: Observable<Class[]>;
  fields$: Observable<Field[]>;
  variables$: Observable<VariableDefinition[]>;
  vegaLiteSpec$: Observable<TopLevelSpec>;
  variableAttributes$: Observable<Attribute[]>;
  possibleSecondaryAttributes$: Observable<Attribute[]>;
  triggerCalculatePossibleAttributes$ = new BehaviorSubject<void>(undefined);
  items$: Observable<Item[]>;
  filterDataForOptions$: Observable<Item[]>;
  filterDataForOptionsCopy$: Observable<Item[]>;
  variables: VariableDefinition[] = [];
  aggregations: any[] = [];
  variableAttributes: Attribute[] = [];
  fields: Field[] = [];
  isChartValid$: Observable<boolean>;
  numericProperties$: Observable<Attribute[]>;
  textProperties$: Observable<Attribute[]>;
  comparisons = [
    {
      id: 'item',
      name: this.translateService.instant('@pry.widget.chart.comparison.item')
    },
    {
      id: 'value',
      name: this.translateService.instant('@pry.widget.chart.comparison.value')
    }
  ];
  view?: View;
  trigger$ = new Subject<void>();
  invalidJson: boolean = false;

  constructor(
    store: Store<any>,
    private translateService: PryI18nService,
    el: ElementRef,
    private cdRef: ChangeDetectorRef
  ) {
    super(store, el);

    this.store.select(ConfigSelectors.chartOption).subscribe((chartOptions: ChartOption) => {
      this.aggregations = chartOptions.aggregation;
      this.schemes = chartOptions.color.map((scheme) => ({ id: scheme, translated: '' }));
      this.markTypes = chartOptions.type;
      this.subTypes = chartOptions.subType;

      this.typeOptions = this.markTypes
        .map((type: MarkType) => {
          // @ts-ignore
          return this.subTypes && this.subTypes[type] ? this.subTypes[type].map((subType) => ({ type, subType })) : [];
        })
        .reduce((p, c) => [...p, ...c], [])
        .map((options: any) => ({
          ...options,
          id: `${options.type}-${options.subType}`,
          label: options.subType === MarkSubType.DEFAULT ? options.type : options.subType
        }))
        .map((options: any) => ({
          ...options,
          translated: this.translateService.instant('@pry.widget.chart.markType.' + options.label)
        }));
      this.typeOptions.sort((a, b) => a.translated?.localeCompare(b.translated ?? '') ?? -1);
    });
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.fields$ = this.store.select(FieldSelectors.fields);

    this.variableAttributes$ = combineLatest([this.resultSet$, this.classes$, this.fields$]).pipe(
      map(([resultSet, classes, fields]) => ItemUtils.getAttributesFromRs(resultSet, classes, fields)),
      map((fields: Attribute[]) => fields.sort((a, b) => a.name.localeCompare(b.name))),
      map((props) => WidgetChartComponent.uniqueAttributesByNames(props)),
      distinctUntilChanged((p, c) => equal(p, c))
    );

    this.subscriptions.add(this.variableAttributes$.subscribe((attrs) => (this.variableAttributes = attrs)));
    this.subscriptions.add(this.fields$.subscribe((attrs) => (this.fields = attrs)));

    this.variables$ = combineLatest([this.variableAttributes$, this.fields$]).pipe(
      map(([attributes, fields]) => {
        return attributes.map(
          (attr) =>
            (({
              name: attr.technicalName,
              label: attr.name,
              type: this.translateToVegaType(
                fields.find((field) => field.id === attr.field)?.type ?? FieldType.STRING,
                attr.name
              )
            } as VariableDefinition) ?? [])
        );
      })
    );

    this.options$ = combineLatest([
      this.variables$,
      this.manifest$.pipe(map((manifest) => manifest.options as ChartWidgetOptions))
    ]).pipe(
      map(([variables, options]) => ({
        ...options,
        title: options?.title ?? ((variables[0]?.label ?? '') + ', ' + (variables[1]?.label ?? '')).replace(/^, $/, ''),
        selectedVariables: options?.selectedVariables ?? [{}, {}],
        // Here, we do not presume of the type of graph that the user wants, and prefer to display a button to go to params
        type: options?.type ?? undefined,
        aggregation: options?.aggregation ?? Aggregation.COUNT,
        tooltip: options?.tooltip ?? true,
        legend: options.legend ?? true,
        locale: 'fr'
      }))
    );

    this.items$ = this.resultSet$.pipe(
      filter((resultSet) => !!resultSet),
      map((resultSet) => {
        return Object.keys(resultSet?.items)
          .map((classId) => resultSet.items[classId])
          .reduce((prev, curr) => [...prev, ...curr], []);
      })
    );

    this.possibleSecondaryAttributes$ = combineLatest([
      this.variableAttributes$,
      this.items$,
      this.fields$,
      this.triggerCalculatePossibleAttributes$
    ]).pipe(
      map(([variableFields, items, fields, _]) => {
        return variableFields
          .filter((attribute) => {
            // Keep only numeric values when necessary
            if (
              !this.optionsCopy.aggregation ||
              [Aggregation.NONE, Aggregation.DISTINCT, Aggregation.COUNT].includes(this.optionsCopy.aggregation)
            ) {
              return true;
            } else {
              const field = fields.find((field) => field.id === attribute.field);
              return [FieldType.DECIMAL, FieldType.INSTANT, FieldType.LONG, FieldType.INTEGER].includes(
                field?.type ?? FieldType.STRING
              );
            }
          })
          .filter((attribute) =>
            items.find(
              (item) =>
                Object.keys(item.attributes).includes(this.optionsCopy.selectedVariables[0].label) &&
                Object.keys(item.attributes).includes(attribute.technicalName) &&
                !!(item.attributes[this.optionsCopy.selectedVariables[0].label] as AttributeSimpleValue).value &&
                (item.attributes[attribute.name] as AttributeSimpleValue).value !== undefined
            )
          );
      }),
      map((props) => WidgetChartComponent.uniqueAttributesByNames(props))
    );

    this.numericProperties$ = combineLatest([
      this.variableAttributes$,
      this.items$,
      this.fields$,
      this.triggerCalculatePossibleAttributes$
    ]).pipe(
      map(([variableFields, items, fields, _]) => {
        return variableFields
          .filter((attribute) => {
            const field = fields.find((field) => field.id === attribute.field);
            return [FieldType.DECIMAL, FieldType.INSTANT, FieldType.LONG, FieldType.INTEGER].includes(
              field?.type ?? FieldType.STRING
            );
          })
          .filter((attribute) =>
            items.find(
              (item) =>
                Object.keys(item.attributes).includes(attribute.technicalName) &&
                (item.attributes[attribute.technicalName] as AttributeSimpleValue).value !== undefined
            )
          );
      }),
      map((props) => {
        return WidgetChartComponent.uniqueAttributesByNames(props);
      })
    );

    this.textProperties$ = combineLatest([
      this.variableAttributes$,
      this.items$,
      this.fields$,
      this.triggerCalculatePossibleAttributes$
    ]).pipe(
      map(([variableFields, items, fields, _]) => {
        return variableFields
          .filter((attribute) => {
            const field = fields.find((field) => field.id === attribute.field);
            return [FieldType.STRING, FieldType.KEYWORD].includes(field?.type ?? FieldType.INTEGER);
          })
          .filter((attribute) =>
            items.find(
              (item) =>
                Object.keys(item.attributes).includes(attribute.technicalName) &&
                (item.attributes[attribute.technicalName] as AttributeSimpleValue).value !== undefined
            )
          );
      }),
      map((props) => {
        return WidgetChartComponent.uniqueAttributesByNames(props);
      })
    );

    this.filterDataForOptions$ = combineLatest([this.items$, this.options$, this.variableAttributes$]).pipe(
      filter(([items, options]) => options.selectedVariables && options.selectedVariables.length > 0),
      map(([items, options, variables]) => WidgetChartComponent.matchingItems(items, options, variables))
    );

    this.filterDataForOptionsCopy$ = combineLatest([
      this.items$,
      this.triggerCalculatePossibleAttributes$.pipe(delay(200)),
      this.variableAttributes$
    ]).pipe(
      filter(([items, _]) => this.optionsCopy.selectedVariables && this.optionsCopy.selectedVariables.length > 0),
      map(([items, _, variables]) => WidgetChartComponent.matchingItems(items, this.optionsCopy, variables))
    );

    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.optionsCopy = JSON.parse(JSON.stringify(options));
        this.updateAdvancedEdit(JSON.stringify(this.optionsCopy.specToMerge));
        this.optionsCopy.type = !this.markTypes.includes(this.optionsCopy.type)
          ? this.markTypes[0]
          : this.optionsCopy.type;
        this.optionsCopy.subType = this.optionsCopy.subType ?? MarkSubType.DEFAULT;
        this.optionsCopy.aggregation = !this.aggregations.includes(this.optionsCopy.aggregation)
          ? this.aggregations[0]
          : this.optionsCopy.aggregation;
        if (this.optionsCopy.series) {
          this.optionsCopy.series.scheme =
            this.optionsCopy.series?.scheme &&
            this.schemes &&
            !this.schemes.find((s) => s.id === this.optionsCopy?.series?.scheme)
              ? this.schemes[0].id
              : this.optionsCopy.series?.scheme;
        }
      })
    );

    this.vegaLiteSpec$ = combineLatest([
      this.store.select(DashboardSelectors.windowManifest),
      this.manifest$,
      this.widgetSize$,
      this.filterDataForOptions$,
      this.options$,
      this.displayHeader$,
      this.variableAttributes$
    ]).pipe(
      map(([windowManifest, widgetManifest, size, data, options, displayHeader, variableField]) => {
        let spec = vegaBaseConf;
        switch (options.type) {
          case MarkType.RADAR:
            spec = vegaRadarConf;
            break;
          case MarkType.CIRCLE_PACK:
            spec = vegaCirclePackConf;
        }

        spec.title = options.customTitle ?? options.title;

        switch (options.type) {
          case MarkType.RADAR:
            spec.signals[0].update = size.width > size.height ? 'height / 2' : 'width / 2';
            spec.data[0].values = WidgetChartComponent.buildDataVegaRadar(data, options);
            spec.scales[2].range.scheme = options.series?.scheme;
            break;
          case MarkType.CIRCLE_PACK:
            spec.data[0].values = JSON.parse(JSON.stringify(data));
            spec.data[1].transform[0].key = 'attributes.' + options.packing?.id + '.value';
            spec.data[1].transform[0].parentKey = 'attributes.' + options.packing?.parentId + '.value';
            spec.data[1].transform[1].field = 'attributes.' + options.packing?.packField + '.value';
            spec.marks[0].encode.enter.tooltip.signal = `datum.attributes.${
              options.packing?.tooltip ?? options.packing?.id
            }.value + ' : ' + datum.attributes.${options.packing?.packField}.value`;
            break;
          default:
            spec.data = { values: JSON.parse(JSON.stringify(data)) };
            spec.layer = [
              {
                mark: {
                  type: options.type,
                  point:
                    options.type === MarkType.POINT ||
                    options.subType === MarkSubType.WITH_LINES_AND_POINTS ||
                    options.subType === MarkSubType.WITH_POINTS,
                  line: options.type === MarkType.LINE || options.subType === MarkSubType.WITH_LINES_AND_POINTS,
                  innerRadius: options.innerRadius,
                  tooltip: options.tooltip ?? true
                },
                encoding: WidgetChartComponent.calculateEncoding(options)
              }
            ];
            if (options.fill) {
              spec.layer[0].mark.fill = options.fill;
            }
            if (options.subType === MarkSubType.AREASTACKED || options.subType === MarkSubType.HISTOSTACKED) {
              spec.data.transform = [
                {
                  type: 'stack',
                  groupby: [options.selectedVariables[0].name],
                  sort: { field: options.series?.groupBy },
                  field: options.selectedVariables[1].name
                }
              ];
            }
        }
        const merged = mergeDeep(spec, { config: fontConfig('Ubuntu, sans-serif') } as any, options.specToMerge);

        if (!!options.specToMerge) {
          console.log(JSON.stringify(spec));
        }

        return merged;
      })
    );

    this.isChartValid$ = this.options$.pipe(
      map(
        (options) =>
          !!options.type &&
          // We must have the correct number of variables to draw the graph
          (options.selectedVariables.filter((v) => !!v.type).length > 1 ||
            (options.selectedVariables.filter((v) => !!v.type).length > 0 &&
              (options.aggregation === Aggregation.COUNT ||
                options.aggregation === Aggregation.DISTINCT ||
                options.aggregation === Aggregation.NONE)))
      )
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      combineLatest([this.vegaLiteSpec$, this.trigger$]).subscribe(([spec, _]) => {
        if (this.vega) {
          this.view?.finalize();
          embed(this.vega.nativeElement, JSON.parse(JSON.stringify(spec)), {
            actions: false,
            renderer: 'svg',
            formatLocale:
              this.optionsCopy.locale === 'fr'
                ? {
                    decimal: ',',
                    thousands: '\u00a0',
                    grouping: [3],
                    currency: ['', '\u00a0€'],
                    percent: '\u202f%'
                  }
                : {
                    decimal: '.',
                    thousands: ',',
                    grouping: [3],
                    currency: ['$', '']
                  },
            // @ts-ignore
            viewClass: VegaErrorHandler
          }).then((result) => (this.view = result.view));
        } else {
          setTimeout(() => this.trigger$.next(), 100);
        }
      })
    );
    this.trigger$.next();
  }

  static calculateEncoding(options: ChartWidgetOptions) {
    const variables = options.selectedVariables ?? [{}, {}];
    switch (options.type) {
      case MarkType.ARC:
        return {
          theta: {
            field: `attributes.${variables[1].name}.value`,
            title: variables[1].label,
            type: variables[1].type,
            aggregate: options.aggregation ?? Aggregation.COUNT
          },
          color: {
            field: `attributes.${variables[0].name}.value`,
            title: variables[0].label,
            type: variables[0].type,
            legend: options.legend ?? true,
            scale: options.scale ?? { scheme: options.series?.scheme ?? 'category20c' }
          }
        };
      case MarkType.RADAR:
        return {};
      default:
        const encoding = {
          x: {
            field: `attributes.${variables[0].name}.value`,
            title: variables[0].label,
            type: variables[0].type,
            timeUnit: variables[0].type === VegaType.TEMPORAL ? variables[0].timeUnit : undefined,
            bin: options.subType === MarkSubType.HISTOGRAM,
            axis: variables[0].axisOptions,
            scale: {
              // Force a false value here so that vega understand properly
              zero: !!variables[0].origin0,
              type: WidgetChartComponent.isTimeUnitUTC(variables[0]) ? 'utc' : undefined
            }
          },
          y: {
            field: `attributes.${variables[1].name}.value`,
            title: variables[1].label,
            type: options.aggregation === Aggregation.COUNT ? VegaType.QUANTITATIVE : variables[1].type,
            timeUnit: variables[1].type === VegaType.TEMPORAL ? variables[1].timeUnit : undefined,
            axis: variables[1].axisOptions,
            aggregate: options.aggregation !== Aggregation.NONE ? options.aggregation : undefined,
            scale: {
              zero: variables[1].origin0,
              type: WidgetChartComponent.isTimeUnitUTC(variables[1]) ? 'utc' : undefined
            }
          }
        };
        if (options.series) {
          // @ts-ignore
          encoding.color = {
            title: `${options.series.groupBy}`,
            field: `attributes.${options.series.groupBy}.value`,
            legend: options.legend
          };
          if (options.series.scheme) {
            // @ts-ignore
            encoding.color.scale = { scheme: options.series.scheme };
          }
        }
        return encoding;
    }
  }

  static buildDataVegaRadar(items: Item[], options: ChartWidgetOptions): RadarValue[] {
    if (options.radar?.compare === 'item') {
      return items
        .map((item, idx) =>
          (options.radar?.props ?? []).map((prop: string) => {
            const itemValueMultiple = ItemUtils.getAttributeValue(item, prop);
            const itemValue = Array.isArray(itemValueMultiple) ? itemValueMultiple[0] : itemValueMultiple;
            return {
              category: idx,
              key: prop,
              value: itemValue?.value
            } as RadarValue;
          })
        )
        .reduce((a: RadarValue[], b: RadarValue[]) => [...a, ...b], [])
        .filter((a: RadarValue) => a.value !== undefined && a.value !== null);
    } else {
      return items
        .map(
          (item, idx) =>
            ({
              category: (item.attributes[options.radar?.categoryProp ?? ''] as AttributeSimpleValue)?.value ?? 'object',
              key: (item.attributes[options.radar?.keyProp ?? ''] as AttributeSimpleValue)?.value,
              value: (item.attributes[options.radar?.valueProp ?? ''] as AttributeSimpleValue)?.value
            } as RadarValue)
        )
        .filter((a: RadarValue) => a.value !== undefined && a.value !== null && !!a.key);
    }
  }

  static matchingItems(items: Item[], options: ChartWidgetOptions, attributes: Attribute[]) {
    return items.filter((item) => {
      switch (options.type) {
        case MarkType.CIRCLE_PACK:
          return !!options.packing?.id && !!options.packing.parentId && !!options.packing.packField;
        case MarkType.RADAR:
          return (
            ((options.radar?.compare === 'item' && (options.radar.props?.length ?? 0) > 2) ||
              (options.radar?.compare !== 'item' &&
                !!options.radar?.keyProp &&
                !!options.radar.valueProp &&
                !!options.radar.categoryProp)) &&
            WidgetChartComponent.buildDataVegaRadar(items, options).length > 0
          );
        default:
          return (
            Object.keys(item.attributes).includes(options.selectedVariables[0].name) &&
            (item.attributes[options.selectedVariables[0].name] as AttributeSimpleValue).value !== undefined &&
            ((Object.keys(item.attributes).includes(options.selectedVariables[1].name) &&
              (item.attributes[options.selectedVariables[1].name] as AttributeSimpleValue).value !== undefined) ||
              options.aggregation === Aggregation.DISTINCT ||
              options.aggregation === Aggregation.COUNT)
          );
      }
    });
  }

  static uniqueAttributesByNames(attributes: Attribute[]): Attribute[] {
    return [...new Set(attributes.map((attr) => attr.technicalName))].map(
      (attrName) => attributes.find((attr) => attr.technicalName === attrName) ?? ({} as Attribute)
    );
  }

  templateTypeTranslationFn = (item: any, args: any[]) =>
    `${args[0]}${item === MarkSubType.DEFAULT ? item : args[1] + args[2] + item}`;

  advancedEdit: string = '{}';

  changeChartTitle(title: string) {
    this.optionsCopy.customTitle = title;
  }

  changeTimeUnit($event: TimeUnit, variable: VariableDefinition) {
    variable.timeUnit = $event;
  }

  changeAggregation($event: Aggregation) {
    this.optionsCopy.aggregation = $event;
    if ([Aggregation.COUNT, Aggregation.DISTINCT].includes($event!)) {
      this.optionsCopy.selectedVariables[1].axisOptions = { tickMinStep: 1 };
    } else {
      delete this.optionsCopy.selectedVariables[1].axisOptions;
    }
    this.triggerCalculatePossibleAttributes$.next();
  }

  changeProperty(attrName: string, index: number) {
    const attr = this.variableAttributes.find((attr) => attr.technicalName === attrName);
    if (!!attr) {
      this.optionsCopy.selectedVariables[index].name = attr.name;
      this.optionsCopy.selectedVariables[index].label = attr.name;
      const field = this.fields.find((field) => field.id === attr.field)?.type ?? FieldType.STRING;
      this.optionsCopy.selectedVariables[index].type = this.translateToVegaType(field, attr.name);
      this.optionsCopy.selectedVariables[index].axisOptions = this.minTick(field);
      this.optionsCopy.title =
        this.optionsCopy.selectedVariables[0].label + ', ' + this.optionsCopy.selectedVariables[1].label;
    }
    this.triggerCalculatePossibleAttributes$.next();
  }

  static isTimeUnitUTC(variableDef: VariableDefinition): boolean {
    let utcRegex = new RegExp(/_utc|utc_|_UTC|UTC_|_Utc|Utc_/, 'g');
    return utcRegex.test(variableDef?.label);
  }

  changeLabel(label: string, index: number) {
    let updateTitle = false;
    if (
      this.optionsCopy.title ===
      this.optionsCopy.selectedVariables[0].label + ', ' + this.optionsCopy.selectedVariables[1].label
    ) {
      updateTitle = true;
    }

    this.optionsCopy.selectedVariables[index].label = label;
    if (updateTitle) {
      //update title if it has not been modified manually
      this.optionsCopy.title =
        this.optionsCopy.selectedVariables[0].label + ', ' + this.optionsCopy.selectedVariables[1].label;
    }
  }

  toggleOriginAtZero(variable: VariableDefinition, $event: boolean) {
    variable.origin0 = $event;
  }

  changeType(typeOptionsId: string) {
    this.optionsCopy = JSON.parse(JSON.stringify(this.optionsCopy));
    const [type, subType] = typeOptionsId.split('-');
    // @ts-ignore
    this.optionsCopy.type = type;
    this.optionsCopy.subType = subType ?? MarkSubType.DEFAULT;

    if (this.optionsCopy.type === MarkType.CIRCLE_PACK) {
      this.optionsCopy.packing = {};
    } else {
      delete this.optionsCopy.packing;
    }

    if (this.optionsCopy.type === MarkType.RADAR) {
      this.optionsCopy.radar = {};
    } else {
      delete this.optionsCopy.radar;
    }

    switch (this.optionsCopy.type) {
      case MarkType.BAR:
      case MarkType.LINE:
        this.optionsCopy.selectedVariables[0].type =
          this.optionsCopy.selectedVariables[0].type !== VegaType.TEMPORAL ? VegaType.NOMINAL : VegaType.TEMPORAL;
        break;
      case MarkType.POINT:
        this.optionsCopy.selectedVariables[1].type =
          this.optionsCopy.selectedVariables[1].type !== VegaType.TEMPORAL ? VegaType.QUANTITATIVE : VegaType.TEMPORAL;
        break;
    }

    if (this.optionsCopy.subType === MarkSubType.AREASTACKED || this.optionsCopy.subType === MarkSubType.HISTOSTACKED) {
      this.optionsCopy.series = this.optionsCopy.series ?? {};
    }

    this.resetChart();

    if (subType === MarkSubType.DONUT) {
      this.optionsCopy.innerRadius = this.optionsCopy.innerRadius ?? 50;
    }
  }

  resetChart() {
    if (this.optionsCopy.selectedVariables?.length > 2) {
      this.optionsCopy.selectedVariables.pop();
    }
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: {
        ...this.manifest,
        options: { ...this.optionsCopy }
      }
    });
  }

  translateToVegaType(type: FieldType, name: string): VegaType {
    let idRegex = new RegExp(/_id|id_|_ID|ID_|_Id|Id_/, 'g');
    if (idRegex.test(name)) {
      return VegaType.ORDINAL;
    }
    switch (type) {
      case FieldType.DECIMAL:
      case FieldType.INTEGER:
      case FieldType.LONG:
        return VegaType.QUANTITATIVE;
      case FieldType.INSTANT:
        return VegaType.TEMPORAL;
      case FieldType.KEYWORD:
      case FieldType.STRING:
        return VegaType.NOMINAL;
      default:
        return VegaType.NOMINAL;
    }
  }

  minTick(type: FieldType): { tickMinStep: number } | undefined {
    switch (type) {
      case FieldType.INTEGER:
      case FieldType.LONG:
        return { tickMinStep: 1 };
      case FieldType.DECIMAL:
      case FieldType.INSTANT:
      case FieldType.KEYWORD:
      case FieldType.STRING:
      default:
        return undefined;
    }
  }

  trigger() {
    this.triggerCalculatePossibleAttributes$.next();
  }

  proposeTitle() {
    setTimeout(() => {
      if (this.optionsCopy.type === MarkType.RADAR) {
        if (this.optionsCopy.radar?.compare === 'item') {
          this.optionsCopy.title = this.translateService.instant('@pry.widget.chart.radar.titleItem', {
            props: (this.optionsCopy.radar.props || []).join(', ')
          });
        }
        if (this.optionsCopy.radar?.compare === 'value') {
          this.optionsCopy.title = this.translateService.instant('@pry.widget.chart.radar.titleList', {
            key: this.optionsCopy.radar.keyProp ?? this.translateService.instant('@pry.widget.chart.radar.defineKey'),
            value:
              this.optionsCopy.radar.valueProp ?? this.translateService.instant('@pry.widget.chart.radar.defineValue'),
            category:
              this.optionsCopy.radar.categoryProp ??
              this.translateService.instant('@pry.widget.chart.radar.defineCategory')
          });
        }
      }
      if (this.optionsCopy.type === MarkType.CIRCLE_PACK) {
        this.optionsCopy.title = this.translateService.instant('@pry.widget.chart.circle.title', {
          field: this.optionsCopy.packing?.packField ?? ''
        });
      }
    }, 100);
  }

  changeInnerRadius($event: string) {
    // @ts-ignore
    this.optionsCopy.innerRadius = parseInt($event, 10);
  }

  openSettings() {
    (this.open$ as Subject<void>).next(undefined);
  }

  toggleSeries($event: any) {
    if ($event) {
      this.optionsCopy.series = {};
    } else {
      delete this.optionsCopy.series;
    }
  }

  changeSeries($event: any) {
    if (!this.optionsCopy.series) {
      this.optionsCopy.series = {};
    }
    this.optionsCopy.series.groupBy = $event;
  }

  changeSeriesScheme($event: any) {
    if (!this.optionsCopy.series) {
      this.optionsCopy.series = {};
    }
    this.optionsCopy.series.scheme = $event;
  }

  toggleSeriesLegend($event: any) {
    this.optionsCopy.legend = $event;
  }

  toggleTooltip($event: any) {
    this.optionsCopy.tooltip = $event;
  }

  axeLabel(i: number, optionsCopy: ChartWidgetOptions) {
    if (optionsCopy?.type === MarkType.ARC) {
      return i === 0 ? '@pry.widget.chart.encoding.group' : '@pry.widget.chart.encoding.values';
    }
    return i === 0 ? '@pry.widget.chart.encoding.horizontal' : '@pry.widget.chart.encoding.vertical';
  }

  hasNoType(options: ChartWidgetOptions) {
    return !options || !options.type || options.type.includes('undefined') || options.type.includes('null');
  }

  scheme() {
    return vega.scheme(this.optionsCopy.series?.scheme ?? '');
  }

  toggleSpecToMerge($event: any) {
    if ($event) {
      this.optionsCopy.specToMerge = {};
      this.advancedEdit = '{}';
    } else {
      delete this.optionsCopy.specToMerge;
      this.advancedEdit = '{}';
    }
  }

  updateAdvancedEdit($event: any) {
    const value = $event?.target?.value ?? $event;
    if (value) {
      try {
        this.optionsCopy.specToMerge = JSON.parse(value);
        this.advancedEdit = JSON.stringify(this.optionsCopy.specToMerge, undefined, 4);
        this.invalidJson = false;
      } catch (e) {
        console.error('Invalid json provided');
        this.invalidJson = true;
      }
      this.cdRef.markForCheck();
    } else {
      delete this.optionsCopy.specToMerge;
      this.advancedEdit = '{}';
    }
  }

  override toImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.vega.nativeElement.querySelectorAll('canvas')[0].toDataURL('image/png'));
    });
  }
}
