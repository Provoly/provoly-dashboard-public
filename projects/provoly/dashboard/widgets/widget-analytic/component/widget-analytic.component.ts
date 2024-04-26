import { Component, ElementRef } from '@angular/core';
import {
  AnalyticWidgetOptions,
  Attribute,
  AttributeSimpleValue,
  Class,
  ClassSelectors,
  DataWidgetComponent,
  Item,
  ResultSet,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import { combineLatest, map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-widget-analytic',
  templateUrl: './widget-analytic.component.html'
})
export class WidgetAnalyticComponent extends DataWidgetComponent {
  optionsCopy: AnalyticWidgetOptions = { primaryProp: '', secondaryProp: '', verticalProp: '', valueProp: '' };
  options$: Observable<AnalyticWidgetOptions>;

  primaryProperty$: Observable<string[]>;
  secondaryProperty$: Observable<string[]>;
  verticalProperty$: Observable<string[]>;
  totalProperty$: Observable<string[]>;
  grandTotalProperty$: Observable<string[]>;
  lines$: Observable<{ name: string; value: { [key: string]: { [key: string]: any } } }[]>;
  totals$: Observable<{ name: string; value: { [key: string]: { [key: string]: any } } }[]>;
  grandTotals$: Observable<{ name: any; value: { [p: string]: any } }[]>;
  height$: Observable<number>;
  classes$: Observable<Class[]>;
  availableProperties$: Observable<Attribute[]>;

  change($event: string, prop: 'primaryProp' | 'secondaryProp' | 'valueProp' | 'verticalProp') {
    this.optionsCopy[prop] = $event;
  }

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
    this.options$ = this.manifest$.pipe(map((manifest) => (manifest.options ?? {}) as AnalyticWidgetOptions));
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.height$ = combineLatest([this.widgetSize$, this.displayHeader$]).pipe(
      map(([size, header]) => size.height - (header ? WIDGET_HEADER_HEIGHT : 0))
    );
    this.subscriptions.add(
      this.options$.subscribe((options) => {
        this.optionsCopy = JSON.parse(JSON.stringify(options));
      })
    );
    this.primaryProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.primaryProp))
    );
    this.secondaryProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.secondaryProp, 1))
    );
    this.verticalProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.verticalProp, 1))
    );
    this.totalProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.verticalProp, 2))
    );
    this.grandTotalProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.verticalProp, 3))
    );

    this.lines$ = combineLatest([
      this.options$,
      this.primaryProperty$,
      this.secondaryProperty$,
      this.verticalProperty$,
      this.resultSet$
    ]).pipe(
      map(([options, primaryProps, secondaryProps, verticalProps, rs]) =>
        this.createValueMap(verticalProps, primaryProps, secondaryProps, rs, options, 1)
      )
    );

    this.totals$ = combineLatest([
      this.options$,
      this.primaryProperty$,
      this.secondaryProperty$,
      this.totalProperty$,
      this.resultSet$
    ]).pipe(
      map(([options, primaryProps, secondaryProps, verticalProps, rs]) =>
        this.createValueMap(verticalProps, primaryProps, secondaryProps, rs, options, 2)
      )
    );

    this.grandTotals$ = combineLatest([
      this.options$,
      this.primaryProperty$,
      this.grandTotalProperty$,
      this.resultSet$
    ]).pipe(
      map(([options, primaryProps, verticalProps, rs]) =>
        this.createValueMap(verticalProps, primaryProps, undefined, rs, options, 3)
      )
    );

    this.availableProperties$ = combineLatest([this.classes$, this.resultSet$]).pipe(
      map(([classes, rs]) => {
        const presentClassesId = Object.keys(rs.items);
        const presentClasses = presentClassesId
          .map((classId) => classes.find((cl) => cl.id === classId))
          .filter((cl) => !!cl) as Class[];
        return presentClasses.map((cl) => cl.attributes).flat();
      })
    );
  }

  private matchAttributeValue(item: Item, prop: string, comparisonValue: string | undefined) {
    return comparisonValue ? (item.attributes[prop] as AttributeSimpleValue).value == comparisonValue : true;
  }

  private createValueMap(
    verticalProps: string[],
    primaryProps: string[],
    secondaryProps: string[] | undefined,
    rs: ResultSet,
    options: AnalyticWidgetOptions,
    level?: number
  ) {
    return verticalProps.map((vertical) => {
      const value = {} as { [key: string]: { [key: string]: any } | any };
      primaryProps.forEach((primary) => {
        (secondaryProps ?? [undefined]).forEach((secondary) => {
          const matchingItem = (rs.items[Object.keys(rs.items)[0]] ?? []).find(
            (item) =>
              this.matchAttributeValue(item, options.primaryProp, primary) &&
              this.matchAttributeValue(item, options.secondaryProp, secondary) &&
              this.matchAttributeValue(item, options.verticalProp, vertical) &&
              this.matchAttributeValue(item, 'level', level + '')
          );
          if (!!matchingItem) {
            if (!!secondary) {
              if (!value[primary]) {
                value[primary] = {};
              }
              value[primary][secondary] = (matchingItem!.attributes[options.valueProp] as AttributeSimpleValue).value;
            } else {
              value[primary] = (matchingItem!.attributes[options.valueProp] as AttributeSimpleValue).value;
            }
          }
        });
      });
      return { name: vertical, value };
    });
  }

  getPropertyLabelsForLevel(rs: ResultSet, property: string, level?: number) {
    const values = Object.values(rs.items)
      .map((items) =>
        items
          .filter((item) =>
            level
              ? [level, '' + level].includes(
                  (item.attributes['level'] as AttributeSimpleValue).value as string | number
                )
              : true
          )
          .map((item) => (item.attributes[property] as AttributeSimpleValue).value + '')
      )
      .flat()
      .flat();
    return [...new Set(values)];
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }
}
