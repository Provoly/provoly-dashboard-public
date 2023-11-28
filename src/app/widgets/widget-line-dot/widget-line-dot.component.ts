import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeSimpleValue, DataWidgetComponent, Item, ResultSet } from '@provoly/dashboard';
import { combineLatest, map, Observable } from 'rxjs';

export const DOT_SIZE = 19;

export interface WidgetLineDotOptions {
  lines: { labelProp: string; props: [string, string, string] }[];
}

@Component({
  selector: 'app-widget-line-dot',
  templateUrl: './widget-line-dot.component.html',
  styleUrls: ['./widget-line-dot.component.scss']
})
export class WidgetLineDotComponent extends DataWidgetComponent {
  @ViewChild('render') render!: ElementRef<HTMLDivElement>;

  valuesForLines$: Observable<
    { labelProp: string; label: string; props: [string, string, string]; values: [number, number, number] }[]
  >;
  options$: Observable<WidgetLineDotOptions>;
  data$: Observable<Item>;
  minMax$: Observable<[number, number]>;
  minMaxLabels = ['Min', 'Moy', 'Max'];

  get options() {
    return this.manifest.options as WidgetLineDotOptions;
  }

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
    this.data$ = this.resultSet$.pipe(map((rs) => WidgetLineDotComponent.getValues(rs)));
    this.options$ = this.manifest$.pipe(map((manifest) => manifest.options as WidgetLineDotOptions));
    this.valuesForLines$ = combineLatest([this.data$, this.options$]).pipe(
      map(([item, options]) =>
        options.lines.map((line) => ({
          ...line,
          label: (((item.attributes[line.labelProp] as AttributeSimpleValue)?.value as string) ?? '').toUpperCase(),
          values: line.props
            .map((prop) =>
              parseFloat((((item.attributes[prop] as AttributeSimpleValue)?.value ?? 0) + '').replace(',', '.'))
            )
            .map(Math.round) as [number, number, number]
        }))
      )
    );
    this.minMax$ = this.valuesForLines$.pipe(
      map((data) => data.map((d) => d.values).flat()),
      map((flat) => [flat.reduce((a, b) => Math.min(a, b), 999999), flat.reduce((a, b) => Math.max(a, b), 0)])
    );
  }

  static getValues(data: ResultSet) {
    return (
      (data.items[Object.keys(data.items)[0] ?? ''] ?? [])[0] ?? {
        attributes: {}
      }
    );
  }

  marginStart(parent: HTMLTableCellElement, value: number, minMax: [number, number] = [10, 10]) {
    const size = parent.offsetWidth - 2 * 15 - 3 * DOT_SIZE; // parent size minus padding minus dot size
    const percent = (value - minMax[0] ?? 10) / (minMax[1] - minMax[0]);
    return size * percent;
  }

  marginMiddle(parent: HTMLTableCellElement, value: number, next: number, minMax: [number, number] = [10, 10]) {
    const size = parent.offsetWidth - 2 * 15 - 3 * DOT_SIZE; // parent size minus padding minus dot size
    const percent = (next - value ?? 10) / (minMax[1] - minMax[0]);
    return size * percent;
  }
}
