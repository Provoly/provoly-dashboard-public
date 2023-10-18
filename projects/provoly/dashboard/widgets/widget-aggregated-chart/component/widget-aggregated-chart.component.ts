import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  ChartAggregatedWidgetOptions,
  Class,
  ClassSelectors,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  FieldType,
  GraphType,
  Operation,
  PryAggregationService,
  PryI18nService,
  ValueType,
  VegaColorType,
  VegaType,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import {
  BehaviorSubject,
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
  withLatestFrom
} from 'rxjs';
import { View } from 'vega';
import embed, { vega } from 'vega-embed';
import { mergeDeep, TopLevelSpec } from 'vega-lite';
import { fontConfig } from 'vega-lite/build/src/config';

vega.scheme('KO/W/OK', ['#C04D3F', '#FD9843', '#9ABE29']);

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
    ordinate: { vegaType: VegaType; fieldType: any; name: string };
    abscissa: { vegaType: VegaType; fieldType: any; name: string };
    groupBy: { vegaType?: VegaType; fieldType?: any; name: string };
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
  schemes: { id: string }[] = [];
  noData$: Observable<boolean>;
  sortActive? = 'name';
  sortDirection? = 'asc';
  noAggregationData$: Observable<boolean>;

  constructor(
    store: Store<any>,
    private translateService: PryI18nService,
    el: ElementRef,
    private aggregationService: PryAggregationService
  ) {
    super(store, el);
    this.schemes = Object.values(VegaColorType).map((id) => ({ id }));
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

    this.operations$ = combineLatest([this.resultSet$, this.classes$, this.fields$]).pipe(
      map(([rs, classes, fields]) =>
        classes
          .filter((clazz) => Object.keys(rs.items).includes(clazz.id))
          .map((clazz) => clazz.attributes)
          .map((attrs) =>
            attrs.filter((attr) => {
              const field = fields.find((field) => {
                return field.id === attr.field;
              });
              return !!field && [FieldType.INTEGER, FieldType.DECIMAL, FieldType.LONG].includes(field.type);
            })
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

    this.abscissaAttributes$ = combineLatest([this.classes$, this.fields$, this.resultSet$, this.optionsCopy$]).pipe(
      map(([classes, fields, rs, optionCopy]) =>
        classes
          .filter((clazz) => Object.keys(rs.items).includes(clazz.id))
          .map((clazz) => clazz.attributes)
          .map((attrs) =>
            attrs.filter((attr) => {
              const field = fields.find((field) => {
                return field.id === attr.field;
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
      this.classes$,
      this.fields$,
      this.resultSet$,
      this.triggerOrdinateAttributes$
    ]).pipe(
      map(([classes, fields, rs]) =>
        classes
          .filter((clazz) => Object.keys(rs.items).includes(clazz.id))
          .map((clazz) => clazz.attributes)
          .map((attrs) =>
            attrs.filter((attr) => {
              const field = fields.find((field) => {
                return field.id === attr.field;
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

    this.attributeTypes$ = combineLatest([this.options$, this.fields$, this.classes$]).pipe(
      filter(([options, fields, classes]) => !!options.abscissa && !!options.ordinate),
      map(([options, fields, classes]) => {
        const abscissa = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options.abscissa.attribute))
          .find((attr) => !!attr);
        const ordinate = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options.ordinate.attribute))
          .find((attr) => !!attr);
        const groupBy = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options.groupBy?.attribute))
          .find((attr) => !!attr);
        const abscissaFieldType = fields.find((field) => field.id === abscissa?.field)?.type ?? FieldType.STRING;
        const ordinateFieldType = fields.find((field) => field.id === ordinate?.field)?.type ?? FieldType.STRING;
        const groupByFieldType = fields.find((field) => field.id === groupBy?.field)?.type ?? FieldType.STRING;
        return {
          abscissa: {
            fieldType: abscissaFieldType,
            vegaType: this.translateToVegaType(abscissaFieldType, abscissa?.name ?? ''),
            name: abscissa?.name ?? ''
          },
          ordinate: {
            fieldType: ordinateFieldType,
            vegaType:
              options.ordinate.operation === Operation.COUNT || options.ordinate.operation === Operation.DISTINCT
                ? VegaType.QUANTITATIVE
                : this.translateToVegaType(ordinateFieldType, ordinate?.name ?? ''),
            name: ordinate?.name ?? ''
          },
          groupBy: {
            fieldType: groupByFieldType,
            vegaType: this.translateToVegaType(groupByFieldType, groupBy?.name),
            name: groupBy?.name ?? ''
          }
        };
      })
    );

    this.aggregatedValues$ = combineLatest([
      this.datasourceIds$,
      this.options$,
      this.resultSet$.pipe(filter((rs) => (rs.merged ?? 0) > 0)),
      combineLatest([fromEvent(window, 'datasourceRefresh'), this.datasourceIds$]).pipe(
        filter(([event, datasources]) => datasources.includes((event as CustomEvent).detail)),
        startWith(undefined)
      )
    ]).pipe(
      debounceTime(100),
      switchMap(([datasources, options]) => this.aggregationService.aggregate(datasources, options)),
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
        return mergeDeep(
          {
            $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
            title: this.getTitle(options),
            width: 'container',
            height: (size.height ?? 100) - (display ? WIDGET_HEADER_HEIGHT : 0),
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
                        type: types.abscissa.vegaType,
                        timeUnit:
                          types.abscissa.vegaType === VegaType.TEMPORAL && options.abscissa.limit?.isTimeLimit
                            ? options.abscissa.limit.interval
                            : undefined,
                        bin: options.graph.type.indexOf('histogram') >= 0,
                        axis: {
                          //format: types.abscissa.vegaType === VegaType.TEMPORAL ? '%Y-%B-%dT%H:%M:%S' : undefined,
                          grid: false,
                          ...WidgetAggregatedChartComponent.minTick(types.abscissa.fieldType),
                          labelExpr: `height < 300 ? ${
                            types.abscissa.vegaType === VegaType.TEMPORAL
                              ? "timeFormat(datum.value, '%Y-%B-%dT%H:%M:%S')"
                              : 'truncate(datum.value, 10)'
                          } : ${
                            types.abscissa.vegaType === VegaType.TEMPORAL
                              ? "timeFormat(datum.value, '%Y-%B-%dT%H:%M:%S')"
                              : 'datum.value'
                          }`
                        },
                        scale: {
                          // Force a false value here so that vega understands properly
                          zero: !!options.abscissa.keep0
                          //type: WidgetChartComponent.isTimeUnitUTC(variables[0]) ? 'utc' : undefined
                        }
                      }
                    : undefined,
                  y: !isCircular
                    ? {
                        field: 'value',
                        title: options.ordinate.label,
                        type: types.ordinate.vegaType,
                        axis: {
                          ...WidgetAggregatedChartComponent.minTick(types.ordinate.fieldType),
                          ...this.setTickCount(values.data)
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
                    field: !isCircular ? 'series' : 'key',
                    legend: options.graph.legend,
                    scale: options.graph.legend ? { scheme: options.groupBy?.color ?? this.schemes[0].id } : undefined
                  },
                  xOffset: stacked && options.groupBy ? { field: 'series' } : undefined,
                  tooltip: options.graph.tooltip
                    ? options.groupBy
                      ? [
                          {
                            field: 'key',
                            type: types.abscissa.vegaType,
                            title: options.abscissa.label,
                            ...(types.abscissa.vegaType === 'temporal' ? { format: '%Y-%B-%dT%H:%M:%S' } : {})
                          },
                          { field: 'value', type: types.ordinate.vegaType, title: options.ordinate.label },
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
                            ...(types.abscissa.vegaType === 'temporal' ? { format: '%Y-%B-%dT%H:%M:%S' } : {})
                          },
                          { field: 'value', type: types.ordinate.vegaType, title: options.ordinate.label }
                        ]
                    : undefined
                }
              }
            ],
            config: fontConfig('Ubuntu, sans-serif')
          } as any,
          options.additionalSpec
        );
      })
    );
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      combineLatest([this.vegaLiteSpec$, this.trigger$]).subscribe(([spec, _]) => {
        if (this.vega) {
          this.view?.finalize();
          console.log(spec);
          embed(this.vega.nativeElement, JSON.parse(JSON.stringify(spec)), {
            actions: false,
            renderer: 'canvas',
            formatLocale: this.translateService.instantObject('@pry.widget.chart.numberLocale') as any,
            timeFormatLocale: this.translateService.instantObject('@pry.widget.chart.timeFormatLocale') as any
          })
            .then((result) => (this.view = result.view))
            .catch((err) => console.error('Cannot display chart', err));
        } else {
          setTimeout(() => this.trigger$.next(), 100);
        }
      })
    );
    this.trigger$.next();
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
    return options.graph?.title ?? (options.abscissa.label ?? 'key') + ' / ' + (options.ordinate.label ?? 'value');
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
          groupBy: undefined
        });
      }
      if ([GraphType.HISTOGRAM].includes($event)) {
        this.limitElements(true);
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

      this.copyAbscissaField = this.fields.find((field) => attr?.field === field.id);

      this.limitElements(!!this.optionsCopy$.value?.abscissa.limit);
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

      this.copyOrdinateField = this.fields.find((field) => attr?.field === field.id);
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

  limitElements($event: any) {
    if (this.optionsCopy$.value) {
      if ($event) {
        if (
          this.copyAbscissaField?.type !== FieldType.INSTANT &&
          this.optionsCopy$.value?.abscissa?.limit &&
          'at' in this.optionsCopy$.value?.abscissa?.limit
        ) {
          this.optionsCopy$.next({
            ...this.optionsCopy$.value,
            abscissa: {
              ...this.optionsCopy$.value?.abscissa,
              limit: {
                at: this.optionsCopy$.value?.abscissa?.limit?.at ?? 3,
                others: false,
                order: 'asc',
                isTimeLimit: false
              }
            }
          });
        } else {
          this.optionsCopy$.next({
            ...this.optionsCopy$.value,
            abscissa: { ...this.optionsCopy$.value?.abscissa, limit: { interval: 'second', isTimeLimit: true } }
          });
        }
      } else {
        this.optionsCopy$.next({
          ...this.optionsCopy$.value,
          abscissa: { ...this.optionsCopy$.value?.abscissa, limit: undefined }
        });
      }
    }
  }

  changeLimit($event: any) {
    if (
      this.optionsCopy$.value &&
      this.optionsCopy$.value.abscissa.limit &&
      !this.optionsCopy$.value.abscissa.limit.isTimeLimit
    ) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value?.abscissa,
          limit: {
            ...this.optionsCopy$.value?.abscissa.limit,
            at: $event
          }
        }
      });
    }
  }

  changeLimitOthers($event: any) {
    if (
      this.optionsCopy$.value &&
      this.optionsCopy$.value.abscissa.limit &&
      !this.optionsCopy$.value.abscissa.limit.isTimeLimit
    ) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value?.abscissa,
          limit: {
            ...this.optionsCopy$.value?.abscissa.limit,
            others: $event
          }
        }
      });
    }
  }

  changeLimitOrder($event: any) {
    if (
      this.optionsCopy$.value &&
      this.optionsCopy$.value.abscissa.limit &&
      !this.optionsCopy$.value.abscissa.limit.isTimeLimit
    ) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value?.abscissa,
          limit: {
            ...this.optionsCopy$.value?.abscissa.limit,
            order: $event ? 'asc' : 'desc'
          }
        }
      });
    }
  }

  changeTimeLimit($event: any) {
    if (
      this.optionsCopy$.value &&
      this.optionsCopy$.value.abscissa.limit &&
      this.optionsCopy$.value.abscissa.limit.isTimeLimit
    ) {
      this.optionsCopy$.next({
        ...this.optionsCopy$.value,
        abscissa: {
          ...this.optionsCopy$.value.abscissa,
          limit: {
            ...this.optionsCopy$.value.abscissa.limit,
            interval: $event
          }
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
          groupBy: { attribute: this.optionsCopy$.value?.groupBy?.attribute ?? '', color: this.schemes[0].id }
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
    if (this.optionsCopy$.value && this.optionsCopy$.value.groupBy) {
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

  scheme() {
    return vega.scheme(this.optionsCopy$.value?.groupBy?.color ?? '');
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

  override toImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.vega.nativeElement.querySelectorAll('canvas')[0].toDataURL('image/png'));
    });
  }
}
