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
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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
  lines$: Observable<{ name: string; value: { [key: string]: { [key: string]: any } | string } }[]>;
  totals$: Observable<{ name: string; value: { [key: string]: { [key: string]: any } } }[]>;
  grandTotals$: Observable<{ name: any; value: { [p: string]: any } }[]>;
  colorMap$: Observable<{ [vertical: string]: { [primary: string]: string | undefined } }>;
  height$: Observable<number>;
  classes$: Observable<Class[]>;
  availableProperties$: Observable<Attribute[]>;

  change($event: string, prop: 'primaryProp' | 'secondaryProp' | 'valueProp' | 'verticalProp') {
    this.optionsCopy[prop] = $event;
  }

  changeColorConfig($event: string | string[], prop: 'prop' | 'colors') {
    switch (prop) {
      case 'prop': {
        this.optionsCopy.colorConfig!.prop = $event as string;
        break;
      }
      case 'colors': {
        this.optionsCopy.colorConfig!.colors = $event as string[];
        break;
      }
    }
  }

  changeFormat($event: string, prop = 'suffix') {
    this.optionsCopy.format!.suffix = $event;
  }

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
    this.options$ = this.manifest$.pipe(map((manifest) => (manifest.options ?? {}) as AnalyticWidgetOptions));
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.height$ = combineLatest([this.widgetSize$, this.displayHeader$]).pipe(
      map(([size, header]) => size.height - (header ? WIDGET_HEADER_HEIGHT.value : 0))
    );
    this.subscriptions.add(
      this.options$.subscribe((options) => {
        this.optionsCopy = JSON.parse(JSON.stringify(options));
      })
    );
    this.primaryProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      filter(([options]) => !!options.primaryProp),
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.primaryProp))
    );
    this.secondaryProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      filter(([options]) => !!options.secondaryProp),
      map(([options, rs]) => this.getPropertyLabelsForLevel(rs, options.secondaryProp!, 1))
    );
    this.verticalProperty$ = combineLatest([this.options$, this.resultSet$]).pipe(
      filter(([options]) => !!options.verticalProp),
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
      this.primaryProperty$.pipe(startWith([])),
      this.secondaryProperty$.pipe(startWith(undefined)),
      this.verticalProperty$.pipe(startWith([])),
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

    this.colorMap$ = combineLatest([
      this.options$,
      this.resultSet$,
      this.verticalProperty$,
      this.primaryProperty$
    ]).pipe(
      filter(([options]) => !!options.colorConfig),
      map(([options, rs, vertical, primary]) => this.createColorMap(vertical, primary, rs, options))
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

  private matchAttributeValue(item: Item, prop?: string, comparisonValue?: string) {
    return comparisonValue && prop ? (item.attributes[prop] as AttributeSimpleValue).value == comparisonValue : true;
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
              value[primary] = (matchingItem!.attributes[options.valueProp] as AttributeSimpleValue)?.value;
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
            level && 'level' in item.attributes
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

  createColorMap(verticalProps: string[], primaryProps: string[], rs: ResultSet, options: AnalyticWidgetOptions) {
    return options.colorConfig
      ? Object.fromEntries(
          verticalProps.map((vertical) => [
            vertical,
            Object.fromEntries(
              primaryProps.map((primary) => {
                const matchingItem = (rs.items[Object.keys(rs.items)[0]] ?? []).find(
                  (item) =>
                    this.matchAttributeValue(item, options.primaryProp, primary) &&
                    this.matchAttributeValue(item, options.verticalProp, vertical)
                );

                return [
                  primary,
                  matchingItem && (matchingItem.attributes[options.valueProp] as AttributeSimpleValue).value !== 0
                    ? options.colorConfig?.colors[
                        ((matchingItem.attributes[options.colorConfig!.prop] as AttributeSimpleValue).value as number) -
                          1
                      ]
                    : '#FFFFFF'
                ];
              })
            )
          ])
        )
      : {};
  }

  toggleColorConfig($event: boolean) {
    if ($event !== !!this.optionsCopy.colorConfig) {
      if (!this.optionsCopy.colorConfig) {
        this.optionsCopy.colorConfig = { prop: '', colors: [] };
      } else {
        this.optionsCopy.colorConfig = undefined;
      }
    }
  }

  toggleFormat($event: boolean) {
    if ($event !== !!this.optionsCopy.format) {
      if (!this.optionsCopy.format) {
        this.optionsCopy.format = { suffix: '' };
      } else {
        this.optionsCopy.format = undefined;
      }
    }
  }

  modifyColorScheme($event?: string, index?: number) {
    $event && index !== undefined
      ? (this.optionsCopy.colorConfig!.colors[index] = $event)
      : this.optionsCopy.colorConfig!.colors.push('#FFFFFF');
  }

  removeColor(index: number) {
    this.optionsCopy.colorConfig!.colors.splice(index, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
    this.optionsCopy.colorConfig!.colors.splice(
      event.currentIndex,
      0,
      this.optionsCopy.colorConfig!.colors.splice(event.previousIndex, 1)[0]
    );
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }
}
