import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AttributeSimpleValue, DataWidgetComponent } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface WidgetFocusOptions {
  line: { before?: string; during?: string; after?: string; attribute: string }[];
  icon: string;
}

@Component({
  selector: 'app-widget-focus',
  templateUrl: './widget-focus.component.html',
  styleUrls: ['./widget-focus.component.scss']
})
export class WidgetFocusComponent extends DataWidgetComponent {
  @ViewChild('render') render!: ElementRef<HTMLDivElement>;
  values$: Observable<string[]>;

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);

    this.values$ = this.allItems$.pipe(
      map(
        (items) =>
          this.options.line.map(
            (line) =>
              (((items[0] ?? { attributes: {} }).attributes[line.attribute] as AttributeSimpleValue) ?? {})
                .value as string
          ) ?? []
      )
    );
  }

  get options() {
    return this.manifest.options as WidgetFocusOptions;
  }
}
