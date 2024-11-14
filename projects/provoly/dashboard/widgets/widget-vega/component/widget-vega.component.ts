import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AttributeSimpleValue,
  DataWidgetComponent,
  Item,
  PryI18nService,
  PrySnackbarService,
  ResultSet,
  ValueType,
  VegaWidgetOptions,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import { combineLatest, filter, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { View } from 'vega';
import embed, { VisualizationSpec } from 'vega-embed';

@Component({
  selector: 'pry-widget-vega',
  templateUrl: './widget-vega.component.html'
})
export class WidgetVegaComponent extends DataWidgetComponent implements AfterViewInit {
  @ViewChild('vega') vega!: ElementRef;
  view?: View;
  vegaSpec$: Observable<VisualizationSpec>;
  trigger$ = new Subject<void>();
  options$: Observable<any>;
  optionsCopy: VegaWidgetOptions = { baseSpec: {}, placeData: [] };
  formattedBaseSpec: string = '{}';
  initialFormattedBaseSpec: string = '{}';

  constructor(
    store: Store<any>,
    private translateService: PryI18nService,
    el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private snackService: PrySnackbarService
  ) {
    super(store, el);

    this.options$ = this.manifest$.pipe(map((manifest) => (manifest.options ?? {}) as any));
    this.subscriptions.add(
      this.options$.subscribe((options) => {
        this.optionsCopy = JSON.parse(JSON.stringify(options));
        this.formattedBaseSpec = JSON.stringify(this.optionsCopy.baseSpec, undefined, 4);
        this.initialFormattedBaseSpec = JSON.stringify(this.optionsCopy.baseSpec, undefined, 4);
      })
    );

    this.vegaSpec$ = combineLatest([this.options$, this.resultSet$, this.widgetSize$, this.displayHeader$]).pipe(
      filter(([options, rs, size, header]) => !!rs),
      map(([options, rs, size, header]) => {
        const data = WidgetVegaComponent.getValues(rs);

        const vegaSpec = WidgetVegaComponent.placeData(options, JSON.parse(JSON.stringify(options.baseSpec)), data);

        vegaSpec.width = vegaSpec.width ?? size.width - 5;
        vegaSpec.height = vegaSpec.height ?? size.height - 5 - (header ? WIDGET_HEADER_HEIGHT.value : 0);
        vegaSpec.autosize = vegaSpec.autosize ?? { type: 'fit', contains: 'padding' };
        vegaSpec.padding = vegaSpec.padding ?? 15;

        // @ts-ignore
        if (window.widgetVegaLogging === true) {
          console.log(JSON.stringify(vegaSpec, undefined, 4));
        }

        return vegaSpec;
      })
    );
  }

  static getValues(data: ResultSet) {
    return Object.keys(data.items)
      .map((clazz) => data.items[clazz].map((item) => WidgetVegaComponent.transformProvolyModelToClassic(item)))
      .flat();
  }

  static transformProvolyModelToClassic(values: Item) {
    const result = {} as { [key: string]: ValueType };
    Object.keys(values.attributes).forEach((key) => {
      result[key] = (values.attributes[key] as AttributeSimpleValue).value;
    });

    return result;
  }

  static placeData(options: VegaWidgetOptions, baseSpec: any, data: { [key: string]: ValueType }[]) {
    const clone = JSON.parse(JSON.stringify(baseSpec));
    let ref = clone;
    (options.placeData ?? []).forEach((prop, idx, arr) => {
      if (ref) {
        if (idx < arr.length - 1) {
          ref = ref[prop];
        } else {
          ref[prop] = data;
        }
      }
    });
    return clone;
  }

  ngAfterViewInit() {
    this.subscriptions.add(
      combineLatest([this.vegaSpec$, this.trigger$, this.widgetSize$]).subscribe(([spec, _, size]) => {
        if (this.vega) {
          this.view?.finalize();

          // @ts-ignore
          if (this.document.logVegaSpec !== undefined) {
            console.log(JSON.stringify(spec, undefined, 4));
          }

          embed(this.vega.nativeElement, JSON.parse(JSON.stringify(spec)), {
            actions: false,
            renderer: 'canvas',
            formatLocale: this.translateService.instantObject('@pry.widget.chart.numberLocale'),
            timeFormatLocale: this.translateService.instantObject('@pry.widget.chart.timeFormatLocale')
          }).then((result) => (this.view = result.view));
        } else {
          setTimeout(() => this.trigger$.next(), 100);
        }
      })
    );
    this.trigger$.next();
  }

  override toImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.vega.nativeElement.querySelectorAll('canvas')[0].toDataURL('image/png'));
    });
  }

  override emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }

  changePlaceData($event: Event) {
    // @ts-ignore
    const expr = $event.currentTarget.value;
    this.optionsCopy.placeData = expr
      .split('.')
      .map((val: string) => (parseInt(val) + '' === `${val}` ? parseInt(val) : val));
  }

  changeSpec($event: Event) {
    try {
      // @ts-ignore
      this.optionsCopy.baseSpec = JSON.parse($event.currentTarget.value);
    } catch (e) {
      const message = this.snackService.notMitigatedOpen({
        type: 'error',
        message: this.translateService.instant('@pry.widget.vega.notParseableSpec'),
        action: this.translateService.instant('@pry.widget.vega.specReinit')
      });
      message?.subscribe(() => {
        this.optionsCopy.baseSpec = this.initialFormattedBaseSpec;
      });
    }
  }
}
