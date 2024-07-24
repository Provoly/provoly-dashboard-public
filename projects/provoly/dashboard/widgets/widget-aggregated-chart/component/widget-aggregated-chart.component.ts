import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  ChartAggregatedWidgetOptions,
  Class,
  ClassSelectors,
  Dataset,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  FieldType,
  GraphType,
  MonoClassSearchPayload,
  MultiClassSearchPayload,
  NamedQuery,
  NamedQueryTypes,
  Operation,
  PryAggregationService,
  PryI18nService,
  SearchActions,
  Sort,
  ValueType,
  VegaType,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  filter,
  fromEvent,
  map,
  Observable,
  share,
  startWith,
  Subject,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs';
import { View } from 'vega';
import embed, { vega } from 'vega-embed';
import { mergeDeep, TopLevelSpec } from 'vega-lite';
import { initConfig } from 'vega-lite/build/src/config';
import { PrySchemeService } from '@provoly/dashboard/components/scheme-picker';

export const CHART_INTERVAL_STEP = 3;

@Component({
  selector: 'pry-widget-aggregated-chart',
  templateUrl: './widget-aggregated-chart.component.html'
})
export class WidgetAggregatedChartComponent extends DataWidgetComponent implements AfterViewInit {
  @ViewChild('vega') vega!: ElementRef;
  options$: Observable<ChartAggregatedWidgetOptions>;
  optionsCopy$ = new BehaviorSubject<ChartAggregatedWidgetOptions | null>(null);
  view?: View;
  trigger$ = new Subject<void>();
  vegaLiteSpec$: Observable<TopLevelSpec>;
  fields$: Observable<Field[]>;
  classes$: Observable<Class[]>;
  attributeTypes$: Observable<{
    ordinate: { vegaType: VegaType; field?: Field; name: string };
    abscissa: { vegaType: VegaType; field?: Field; name: string };
    groupBy: { vegaType?: VegaType; field?: Field; name: string };
  }>;
  aggregatedValues$: Observable<{ data: any; operation: any }>;
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;
  GraphType = GraphType;
  Operation = Operation;
  isChartValid$: Observable<boolean>;
  typeOptions: { id: string; label: string }[] = [];
  operations$: Observable<{ id: string; label: string }[]>;
  abscissaAttributes$: Observable<Attribute[]>;
  classes: Class[] = [];
  fields: Field[] = [];
  ordinateAttributes$: Observable<Attribute[]>;
  triggerOrdinateAttributes$ = new Subject<void>();
  copyAbscissaField?: Field;
  copyOrdinateField?: Field;
  noData$: Observable<boolean>;
  sortActive? = 'name';
  sortDirection? = 'asc';
  sortValues$: Observable<{ value: 'key' | 'value'; attrId?: string; label?: string; isDisplayed: boolean }[]>;
  sortDirections = [
    { value: 'asc', label: '' },
    { value: 'desc', label: '' }
  ];
  noAggregationData$: Observable<boolean>;
  allowedClasses$: Observable<Class[]>;
  colors = vega.scheme('Provoly');
  DEFAULT_ITEM_LIMIT = 20;

  constructor(
    store: Store<any>,
    private translateService: PryI18nService,
    el: ElementRef,
    private aggregationService: PryAggregationService,
    private schemeService: PrySchemeService
  ) {
    super(store, el);
    this.typeOptions = Object.values(GraphType)
      .map((v) => ({
        id: v,
        label: this.translateService.instant('@pry.widget.chart.graphType.' + v)
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    this.options$ = this.manifest$.pipe(
      map(
        (manifest) =>
          mergeDeep(
            {
              graph: { type: GraphType.BAR, tooltip: true, legend: false },
              abscissa: { keep0: true },
              ordinate: { keep0: true }
            } as ChartAggregatedWidgetOptions,
            (manifest.options ?? {}) as ChartAggregatedWidgetOptions
          ) as ChartAggregatedWidgetOptions
      )
    );
    this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
      this.optionsCopy$.next(JSON.parse(JSON.stringify(options)));
    });
    this.fields$ = this.store.select(FieldSelectors.fields);
    this.classes$ = this.store.select(ClassSelectors.classes);

    const usedAttributes$ = combineLatest([this.usedDatasources$, this.classes$]).pipe(
      map(([datasources, classes]) => {
        const usedClasses = datasources
          .filter((ds) => ds.sourceType === 'dataset')
          // @ts-ignore
          .map((ds: Dataset) => ds.oClass);

        return this.classes.filter((c) => usedClasses.includes(c.id));
      })
    );

    this.operations$ = combineLatest([this.usedDatasources$, this.classes$, this.fields$]).pipe(
      map(([datasources, classes, fields]) =>
        classes
          .filter((clazz) => datasources.map((ds) => ('oClass' in ds ? ds.oClass : undefined)).includes(clazz.id))
          .map((clazz) => clazz.attributes)
          .map((attrs) =>
            attrs.filter((attr) => [FieldType.INTEGER, FieldType.DECIMAL, FieldType.LONG].includes(attr.field.type))
          )
          .reduce((a, b) => [...a, ...b], [])
          .filter((attr) => !!attr)
      ),
      map((attributes) =>
        (attributes.length > 0
          ? Object.values(Operation).filter((operation) => operation !== Operation.EXTENT)
          : [Operation.COUNT, Operation.DISTINCT, Operation.NONE]
        )
          .map((v) => ({
            id: v,
            label: this.translateService.instant('@pry.widget.chart.operation.' + v)
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      )
    );

    this.subscriptions.add(this.fields$.subscribe((fields) => (this.fields = fields)));
    this.subscriptions.add(this.classes$.subscribe((classes) => (this.classes = classes)));

    this.allowedClasses$ = combineLatest([this.classes$, this.usedDatasources$]).pipe(
      map(([classes, datasources]) => {
        const hasFullText = datasources
          .map((ds) => ds.sourceType === 'namedQuery' && ds.request.type === NamedQueryTypes.MULTI_CLASS)
          .reduce((p, c) => p || c, false);

        const multiClassDatasourcesClasses = datasources
          .filter((ds) => ds.sourceType === 'namedQuery' && ds.request.type === NamedQueryTypes.MULTI_CLASS)
          .map((multiDs) => (multiDs as NamedQuery).request as MultiClassSearchPayload)
          .map((payload) => payload.oClasses);

        const hasMultiNoClass = multiClassDatasourcesClasses.includes(undefined);

        const multiClasses = (
          multiClassDatasourcesClasses.filter((classes) => !!classes) as unknown as string[]
        ).reduce((p, c) => [...p, ...c], [] as string[]);

        const singleClasses = datasources
          .filter(
            (ds) =>
              (ds.sourceType === 'namedQuery' && ds.request.type === NamedQueryTypes.MONO_CLASS) ||
              ds.sourceType === 'dataset'
          )
          .map(
            (singleDs) =>
              (singleDs as Dataset).oClass ?? ((singleDs as NamedQuery).request as MonoClassSearchPayload).oClass
          );

        return classes.filter(
          (clazz) =>
            hasFullText || hasMultiNoClass || multiClasses.includes(clazz.id) || singleClasses.includes(clazz.id)
        );
      })
    );

    this.abscissaAttributes$ = combineLatest([this.fields$, this.allowedClasses$, this.optionsCopy$]).pipe(
      map(([fields, allowedClasses, optionCopy]) =>
        allowedClasses
          .map((clazz) => clazz.attributes)
          .map((attrs) =>
            attrs.filter((attr) => {
              const field = fields.find((field) => {
                return field.id === attr.field.id;
              });
              return (
                !!field &&
                field.type !== FieldType.RAW &&
                field.type !== FieldType.STRING &&
                (optionCopy?.graph.type !== GraphType.HISTOGRAM || field.type !== FieldType.KEYWORD)
              );
            })
          )
          .reduce((a, b) => [...a, ...b], [])
      )
    );

    this.ordinateAttributes$ = combineLatest([
      this.fields$,
      this.allowedClasses$,
      this.triggerOrdinateAttributes$
    ]).pipe(
      map(([fields, allowedClasses]) =>
        allowedClasses
          .map((clazz) => clazz.attributes)
          .map((attrs) =>
            attrs.filter((attr) => {
              const field = fields.find((field) => {
                return field.id === attr.field.id;
              });
              if (
                this.optionsCopy$.value &&
                [
                  Operation.MAX,
                  Operation.MIN,
                  Operation.SUM,
                  Operation.Q1,
                  Operation.Q3,
                  Operation.AVERAGE,
                  Operation.MEDIAN,
                  Operation.NONE
                ].includes(this.optionsCopy$.value.ordinate.operation)
              ) {
                return (
                  !!field &&
                  [FieldType.INTEGER, FieldType.INSTANT, FieldType.LONG, FieldType.DECIMAL].includes(field.type)
                );
              }
              return !!field && field.type !== FieldType.RAW && field.type !== FieldType.STRING;
            })
          )
          .reduce((a, b) => [...a, ...b], [])
      )
    );

    this.isChartValid$ = combineLatest([this.options$, this.abscissaAttributes$, this.ordinateAttributes$]).pipe(
      map(([options, abscissaAttrs, ordinateAttrs]) => {
        return (
          !!options.abscissa.attribute &&
          abscissaAttrs.map((attr) => attr.id).includes(options.abscissa.attribute) &&
          (options.ordinate.attribute
            ? ordinateAttrs.map((attr) => attr.id).includes(options.ordinate.attribute)
            : true)
        );
      })
    );

    this.attributeTypes$ = combineLatest([this.optionsCopy$, this.fields$, this.classes$]).pipe(
      filter(([options, fields, classes]) => !!options && !!options.abscissa && !!options.ordinate),
      map(([options, fields, classes]) => {
        const abscissa = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options!.abscissa.attribute))
          .find((attr) => !!attr);
        const ordinate = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options!.ordinate.attribute))
          .find((attr) => !!attr);
        const groupBy = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options?.groupBy?.attribute))
          .find((attr) => !!attr);
        return {
          abscissa: {
            field: abscissa?.field,
            vegaType: this.translateToVegaType(abscissa?.field.type, abscissa?.name ?? ''),
            name: abscissa?.name ?? ''
          },
          ordinate: {
            fieldType: ordinate?.field,
            vegaType:
              options!.ordinate.operation === Operation.COUNT || options!.ordinate.operation === Operation.DISTINCT
                ? VegaType.QUANTITATIVE
                : this.translateToVegaType(ordinate?.field.type, ordinate?.name ?? ''),
            name: ordinate?.name ?? ''
          },
          groupBy: {
            field: groupBy?.field,
            vegaType: this.translateToVegaType(groupBy?.field.type, groupBy?.name),
            name: groupBy?.name ?? ''
          }
        };
      })
    );

    this.aggregatedValues$ = combineLatest([
      this.datasourceIds$,
      this.options$,
      combineLatest([fromEvent(window, 'datasourceRefresh'), this.datasourceIds$]).pipe(
        filter(([event, datasources]) =>
          datasources.includes((event as CustomEvent).detail.replace(/$aggregate!/, ''))
        ),
        startWith(undefined)
      )
    ]).pipe(
      debounceTime(100),
      tap(([datasources]) => this.store.dispatch(SearchActions.setSearchLoading({ datasources, start: true }))),
      switchMap(([datasources, options]) =>
        this.aggregationService.aggregate(datasources, options).pipe(
          tap(() => this.store.dispatch(SearchActions.setSearchLoading({ datasources, start: false }))),
          catchError((err) => {
            this.store.dispatch(SearchActions.setSearchLoading({ datasources, start: false }));
            throw err;
          })
        )
      ),
      withLatestFrom(this.options$),
      map(([aggregate, options]) => {
        // @ts-ignore
        if (aggregate.values.length > 0 && !aggregate.values[0].groupBy) {
          return {
            operation: aggregate.operation,
            data: aggregate.values.map((value) => ({ ...value, series: options.ordinate.label }))
          };
        }
        const flattened = (
          aggregate.values as {
            key: ValueType;
            groupBy: {
              key: ValueType;
              value: ValueType;
            }[];
          }[]
        )
          .map((value) =>
            value.groupBy.map((groupBy) => ({
              key: value.key,
              series: groupBy.key,
              value: groupBy.value
            }))
          )
          .reduce((a, b) => [...a, ...b], []);
        return { operation: aggregate.operation, data: flattened };
      }),
      startWith({ operation: Operation.NONE, data: [] }),
      share()
    );

    this.noData$ = this.datasourceIds$.pipe(map((ids) => ids.length === 0));
    this.noAggregationData$ = this.aggregatedValues$.pipe(map(({ data }) => data.length === 0));

    this.vegaLiteSpec$ = combineLatest([
      this.options$,
      this.attributeTypes$,
      this.aggregatedValues$,
      this.widgetSize$.pipe(debounceTime(100)),
      this.displayHeader$
    ]).pipe(
      map(([options, types, values, size, display]) => {
        const isCircular = [GraphType.CIRCULAR, GraphType.DONUT].includes(options.graph.type);
        const stacked = options.graph.type.startsWith('bar') ? !options.graph.stacked : options.graph.stacked;
        const legendTitle = this.translateService.instant(
          options.groupBy ? types.groupBy.name ?? '' : '@pry.widget.chart.legendLabel'
        );

        ([options.groupBy?.color, options.circleColorScheme].filter((scheme) => !!scheme) as string[]).forEach(
          (scheme) => {
            this.schemeService.assertScheme(scheme);
          }
        );
        return mergeDeep(
          {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            title: this.getTitle(options),
            width: 'container',
            height: (size.height ?? 100) - (display ? WIDGET_HEADER_HEIGHT.value : 0),
            padding: 10,
            autosize: { type: 'fit', contains: 'padding' },
            data: { values: JSON.parse(JSON.stringify(values.data)) },
            layer: [
              {
                mark: {
                  type: options.graph.type.split('-')[0] as 'arc' | 'line' | 'point' | 'bar' | 'area',
                  point: options.graph.type.indexOf('point') >= 0,
                  line: options.graph.type.indexOf('line') >= 0,
                  innerRadius: options.graph.donutSize ?? 30
                },
                encoding: {
                  x: !isCircular
                    ? {
                        field: 'key',
                        title: options.abscissa.label,
                        type: this.getAbscissaType(types.abscissa.vegaType, !!options.graph.sort),
                        bin: options.graph.type.indexOf('histogram') >= 0,
                        ...this.getTimeUnit(options, types.abscissa.vegaType),
                        axis: {
                          grid: false,
                          ...WidgetAggregatedChartComponent.minTick(types.abscissa.field?.type ?? FieldType.STRING),
                          labelExpr: this.getLabelExpr('x', types.abscissa.vegaType, types.abscissa.field),
                          ...this.getLabelAngle(types.abscissa.vegaType, values.data)
                        },
                        scale: {
                          // Force a false value here so that vega understands properly
                          zero: !!options.abscissa.keep0
                          //type: WidgetChartComponent.isTimeUnitUTC(variables[0]) ? 'utc' : undefined
                        },
                        ...this.getSort(options.abscissa.attribute, options.graph?.sort)
                      }
                    : undefined,
                  y: !isCircular
                    ? {
                        field: 'value',
                        title: options.ordinate.label,
                        type: types.ordinate.vegaType,
                        axis: {
                          ...WidgetAggregatedChartComponent.minTick(types.ordinate.field?.type ?? FieldType.STRING),
                          ...this.setTickCount(values.data),
                          labelExpr: this.getLabelExpr('y', types.ordinate.vegaType, types.ordinate.field)
                        },
                        scale: {
                          zero: types.ordinate.vegaType === VegaType.QUANTITATIVE ? !!options.ordinate.keep0 : false
                        },
                        ...(stacked ? { stack: true } : {})
                      }
                    : undefined,
                  theta: isCircular ? { field: 'value', type: types.ordinate.vegaType } : undefined,
                  color: {
                    title: legendTitle,
                    field: !isCircular ? (!options.groupBy ? undefined : 'series') : 'key',
                    legend: options.graph.legend,
                    scale: !isCircular
                      ? options.groupBy
                        ? { scheme: options.groupBy?.color ?? this.schemeService.getDefaultScheme() }
                        : undefined
                      : { scheme: options.circleColorScheme ?? this.schemeService.getDefaultScheme() },
                    value:
                      !isCircular && !options.groupBy
                        ? options.baseColor ?? this.schemeService.getSchemeColors(this.schemeService.getDefaultScheme())
                        : undefined
                  },
                  xOffset:
                    stacked &&
                    options.groupBy &&
                    this.getAbscissaType(types.abscissa.vegaType, !!options.graph.sort) !== VegaType.TEMPORAL
                      ? { field: 'series' }
                      : undefined,
                  tooltip: options.graph.tooltip
                    ? options.groupBy
                      ? [
                          {
                            field: 'key',
                            type: types.abscissa.vegaType,
                            title: options.abscissa.label,
                            ...this.getDataFormat(types.abscissa.vegaType, types.abscissa.field)
                          },
                          {
                            field: 'value',
                            type: types.ordinate.vegaType,
                            title: options.ordinate.label,
                            ...this.getDataFormat(types.ordinate.vegaType, types.ordinate.field)
                          },
                          {
                            field: 'series',
                            title: legendTitle,
                            type: 'nominal'
                          }
                        ]
                      : [
                          {
                            field: 'key',
                            type: types.abscissa.vegaType,
                            title: options.abscissa.label,
                            ...this.getDataFormat(types.abscissa.vegaType, types.abscissa.field)
                          },
                          {
                            field: 'value',
                            type: types.ordinate.vegaType,
                            title: options.ordinate.label,
                            ...this.getDataFormat(types.ordinate.vegaType, types.ordinate.field)
                          }
                        ]
                    : undefined
                }
              }
            ],
            config: this.getChartConfig()
          } as any,
          options.additionalSpec
        );
      })
    );

    this.sortValues$ = this.optionsCopy$.pipe(
      map((options) => {
        return [
          {
            attrId: options?.abscissa.attribute,
            label: options?.abscissa.label,
            value: 'key' as 'key' | 'value',
            isDisplayed: true
          },
          {
            attrId: options?.ordinate.attribute,
            label: options?.ordinate.attribute
              ? options?.ordinate.label
              : this.translateService.instant(`@pry.widget.chart.sort.by.operation.${options?.ordinate.operation}`),
            value: 'value' as 'key' | 'value',
            isDisplayed: !!options?.ordinate
          }
        ].filter((value) => value.isDisplayed);
      })
    );

    this.subscriptions.add(
      combineLatest([this.optionsCopy$, this.sortValues$, this.attributeTypes$, this.classes$]).subscribe(
        ([options, sortValues, attrTypes, classes]) => {
          this.sortDirections = this.sortDirections
            .map((sortDir) => {
              let attribute = classes
                .map((clazz) =>
                  clazz.attributes.find(
                    (attr) =>
                      attr.id === sortValues.find((sortValue) => sortValue.value === options?.graph.sort?.value)?.attrId
                  )
                )
                .find((attr) => !!attr);
              return {
                value: sortDir.value,
                label: this.translateService.instant(
                  `@pry.widget.chart.sort.${sortDir.value}.${
                    attrTypes.abscissa.name === attribute?.name
                      ? attrTypes.abscissa.vegaType
                      : attrTypes.ordinate.vegaType
                  }`
                )
              };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
        }
      )
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      combineLatest([this.vegaLiteSpec$, this.trigger$]).subscribe(([spec, _]) => {
        if (this.vega) {
          this.view?.finalize();
          // console.log(JSON.stringify(spec));
          embed(this.vega.nativeElement, JSON.parse(JSON.stringify(spec)), {
            actions: false,
            renderer: 'canvas',
            formatLocale: this.translateService.instantObject('@pry.widget.chart.numberLocale'),
            timeFormatLocale: this.translateService.instantObject('@pry.widget.chart.timeFormatLocale'),
            tooltip: {
              theme: 'custom'
            }
          })
            .then((result) => (this.view = result.view))
            .catch((err) => console.error('Cannot display chart', err));
        } else {
          setTimeout(() => this.trigger$.next(), 100);
        }
      })
    );
    this.trigger$.next();
    if (
      this.optionsCopy$.value &&
      (!!this.optionsCopy$.value.abscissa.limit || this.optionsCopy$.value.abscissa.limit === undefined)
    ) {
      this.toggleLimitItems(true);
    }
  }

  translateToVegaType(type?: FieldType, name?: string): VegaType {
    let idRegex = new RegExp(/_id|id_|_ID|ID_|_Id|Id_/, 'g');
    if (idRegex.test(name ?? '-------')) {
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

  static minTick(type: FieldType): { tickMinStep: number } | {} {
    switch (type) {
      case FieldType.INTEGER:
      case FieldType.LONG:
        return { tickMinStep: 1 };
      case FieldType.DECIMAL:
      case FieldType.INSTANT:
      case FieldType.KEYWORD:
      case FieldType.STRING:
      default:
        return {};
    }
  }

  getSort(abscissa: string, sort?: Sort) {
    return sort ? { sort: { field: sort.value, order: sort.direction + 'ending' } } : {};
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: {
        ...this.manifest,
        options: { ...this.optionsCopy$.getValue() }
      }
    });
  }

  openSettings() {
    (this.open$ as Subject<void>).next(undefined);
  }

  openData() {
    (this.openData$ as Subject<void>).next(undefined);
  }

  private getTitle(options: ChartAggregatedWidgetOptions) {
    return options.graph?.title ?? undefined;
  }

  getChartConfig() {
    return initConfig({
      style: {
        'guide-label': {
          // axis tick titles
          font: 'Ubuntu, sans-serif',
          fontSize: 12,
          fontWeight: 400,
          fill: '#263340'
        },
        'guide-title': {
          // axis title
          font: 'Ubuntu, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          fill: '#3E546A'
        },
        'group-title': {
          // chart title
          font: 'Ubuntu, sans-serif',
          fontSize: 12,
          fontWeight: 400,
          fill: '#263340'
        },
        'group-subtitle': {
          // not sure
          font: 'Ubuntu, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          fill: '#263340'
        }
      }
    });
  }

  changeChartTitle($event: string) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: { ...this.optionsCopy$.value?.graph, title: $event }
      });
    }
  }

  changeType($event: GraphType) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: { ...this.optionsCopy$.value?.graph, type: $event }
      });
      if ([GraphType.CIRCULAR, GraphType.DONUT].includes($event)) {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          groupBy: undefined,
          circleColorScheme: this.optionsCopy$.value?.circleColorScheme ?? 'Provoly'
        });
      }
      if ([GraphType.HISTOGRAM].includes($event)) {
        this.enableIntervals(true);
      }
    }
  }

  changeDonutSize($event: number) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: { ...this.optionsCopy$.value?.graph, donutSize: $event }
      });
    }
  }

  changeOperation($event: Operation) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        ordinate: { ...this.optionsCopy$.value?.ordinate, operation: $event }
      });
      if ($event === Operation.COUNT || $event === Operation.DISTINCT) {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          ordinate: {
            ...this.optionsCopy$.value?.ordinate,
            label: this.translateService.instant('@pry.widget.chart.operation.' + $event),
            attribute: undefined
          }
        });
      }
      setTimeout(() => this.triggerOrdinateAttributes$.next(), 10);
    }
  }

  changeAbscissa($event: string) {
    if ($event && this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: { ...this.optionsCopy$.value?.abscissa, attribute: $event }
      });
      const attr = this.classes
        .map((clazz) => clazz.attributes)
        .reduce((a, b) => [...a, ...b], [])
        .find((attr) => attr.id === $event);
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: { ...this.optionsCopy$.value?.abscissa, label: attr?.name ?? 'attr-not-found' }
      });

      this.copyAbscissaField = this.fields.find((field) => attr?.field.id === field.id);

      this.enableIntervals(!!this.optionsCopy$.value?.abscissa.interval);
    }
  }

  changeAbscissaLabel($event: string) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: { ...this.optionsCopy$.value?.abscissa, label: $event }
      });
    }
  }

  changeOrdinate($event: any) {
    if ($event && this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        ordinate: { ...this.optionsCopy$.value?.ordinate, attribute: $event }
      });
      const attr = this.classes
        .map((clazz) => clazz.attributes)
        .reduce((a, b) => [...a, ...b], [])
        .find((attr) => attr.id === $event);
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        ordinate: { ...this.optionsCopy$.value?.ordinate, label: attr?.name ?? 'attr-not-found' }
      });

      this.copyOrdinateField = this.fields.find((field) => attr?.field.id === field.id);
    }
  }

  changeOrdinateLabel($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        ordinate: { ...this.optionsCopy$.value?.ordinate, label: $event }
      });
    }
  }

  changeKeep0Abscissa($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: { ...this.optionsCopy$.value?.abscissa, keep0: $event }
      });
    }
  }

  changeKeep0Ordinate($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        ordinate: { ...this.optionsCopy$.value?.ordinate, keep0: $event }
      });
    }
  }

  enableIntervals($event: any) {
    if (this.optionsCopy$.value) {
      if ($event) {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          abscissa: {
            ...this.optionsCopy$.value?.abscissa,
            interval:
              this.optionsCopy$.value?.abscissa?.interval ??
              (this.copyAbscissaField?.type !== FieldType.INSTANT ? CHART_INTERVAL_STEP : 'second')
          }
        });
      } else {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          abscissa: { ...this.optionsCopy$.value?.abscissa, interval: undefined }
        });
      }
    }
  }

  changeInterval($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value?.abscissa,
          interval: +$event
        }
      });
    }
  }

  changeTimeInterval($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value.abscissa,
          interval: $event
        }
      });
    }
  }

  toggleLegend($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: { ...this.optionsCopy$.value.graph, legend: $event }
      });
    }
  }

  toggleTooltip($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: { ...this.optionsCopy$.value?.graph, tooltip: $event }
      });
    }
  }

  toggleGroupBy($event: any) {
    if (this.optionsCopy$.value) {
      if ($event) {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          groupBy: {
            attribute: this.optionsCopy$.value?.groupBy?.attribute ?? '',
            color: this.schemeService.getDefaultScheme()
          }
        });
      } else {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          groupBy: undefined
        });
      }
    }
  }

  changeGroupBy($event: any) {
    if (typeof $event === 'string' && this.optionsCopy$.value && this.optionsCopy$.value.groupBy) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        groupBy: {
          ...this.optionsCopy$.value?.groupBy,
          attribute: $event
        }
      });
    }
  }

  changeColorScheme($event: any) {
    if (this.optionsCopy$.value?.groupBy) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        groupBy: {
          attribute: this.optionsCopy$.value.groupBy?.attribute,
          color: $event
        }
      });
    }
  }

  setTickCount(data: any) {
    return Math.max(...data.map((val: any) => val.value)) < 3
      ? { tickCount: Math.max(...data.map((val: any) => val.value)) }
      : {};
  }

  toggleStacked($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: {
          ...this.optionsCopy$.value?.graph,
          stacked: $event
        }
      });
    }
  }

  toggleSort($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: {
          ...this.optionsCopy$.value.graph,
          sort: $event
            ? this.optionsCopy$.value.graph.sort ?? {
                value: 'key',
                direction: 'asc'
              }
            : undefined
        }
      });
    }
  }

  changeSortValue($event: 'key' | 'value') {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: {
          ...this.optionsCopy$.value.graph,
          sort: { ...this.optionsCopy$.value.graph.sort!, value: $event }
        }
      });
    }
  }

  changeSortDirection($event: 'asc' | 'desc') {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        graph: {
          ...this.optionsCopy$.value?.graph,
          sort: { ...this.optionsCopy$.value?.graph.sort!, direction: $event }
        }
      });
    }
  }

  toggleLimitItems($event: boolean) {
    if (this.optionsCopy$.value) {
      if ($event !== !!this.optionsCopy$.value.abscissa.limit || this.optionsCopy$.value.abscissa.limit === undefined) {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          abscissa: {
            ...this.optionsCopy$.value.abscissa,
            limit: this.optionsCopy$.value.abscissa.limit ? null : this.DEFAULT_ITEM_LIMIT
          }
        });
      }
    }
  }

  changeLimitValue($event: number | null) {
    if (this.optionsCopy$.value && $event !== null) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value.abscissa,
          limit: $event > 0 ? $event : 1
        }
      });
    }
  }

  override toImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.vega.nativeElement.querySelectorAll('canvas')[0].toDataURL('image/png'));
    });
  }

  changeCircleColorScheme($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        circleColorScheme: $event
      });
    }
  }

  changeBaseColor($event: any) {
    if (this.optionsCopy$.value) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        baseColor: $event
      });
    }
  }

  getTimeUnit(options: ChartAggregatedWidgetOptions, abscissaType: VegaType) {
    if (abscissaType === VegaType.TEMPORAL && typeof options.abscissa.interval === 'string') {
      return { timeUnit: options.abscissa.interval };
    } else if (abscissaType === VegaType.TEMPORAL && !!options.graph.sort) {
      return { timeUnit: 'utcyearmonthdate' };
    }
    return {};
  }

  getLabelAngle(abscissaType: VegaType, data: { key: string | number; value: any }[]) {
    if (
      [VegaType.NOMINAL, VegaType.ORDINAL].includes(abscissaType) &&
      data.some((item: { key: string | number; value: any }) => item.key.toString().length > 10)
    ) {
      return { labelAngle: -30 };
    }
    return {};
  }

  getAbscissaType(abscissaVegaType: VegaType, hasSort: boolean) {
    return hasSort ? VegaType.ORDINAL : abscissaVegaType;
  }

  isTimeInterval(abscissaInterval: string | number) {
    return typeof abscissaInterval === 'string';
  }

  getLabelExpr(axis: 'x' | 'y', axisType: string, field?: Field) {
    const truncateBasedOn = axis === 'x' ? 'height < 300' : 'width < 100';
    const timeFormat = `timeFormat(datum.value, '${this.getLocaleFormat(field?.format)}')`;
    const numberFormat = field?.decimalPrecision
      ? `format(datum.value, '.${field?.decimalPrecision}f')`
      : 'datum.value';
    const truncatedFormat = 'truncate(datum.value, 10)';

    return `${truncateBasedOn} ? ${
      axisType === VegaType.TEMPORAL ? timeFormat : axisType === VegaType.QUANTITATIVE ? numberFormat : truncatedFormat
    } : ${
      axisType === VegaType.TEMPORAL ? timeFormat : axisType === VegaType.QUANTITATIVE ? numberFormat : 'datum.value'
    }`;
  }

  getDataFormat(axisType: string, field?: Field) {
    switch (axisType) {
      case VegaType.TEMPORAL:
        return { format: this.getLocaleFormat(field?.format), scale: { type: 'utc' } };
      case VegaType.QUANTITATIVE:
        return field?.decimalPrecision ? { format: `.${field?.decimalPrecision}f` } : {};
      default:
        return {};
    }
  }

  getLocaleFormat(type: string | undefined) {
    const formats = this.translateService.instantObject('@pry.widget.chart.specializedLocale');
    return formats[type ?? 'default'];
  }
}
