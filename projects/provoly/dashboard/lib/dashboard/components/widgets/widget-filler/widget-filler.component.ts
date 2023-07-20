import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseWidgetComponent } from '../base-widget.component';

@Component({
  selector: 'pry-widget-filler',
  templateUrl: './widget-filler.component.html'
})
export class WidgetFillerComponent extends BaseWidgetComponent {
  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
  }

  get index() {
    // @ts-ignore
    return this.manifest.options?.index ?? 0;
  }
}
