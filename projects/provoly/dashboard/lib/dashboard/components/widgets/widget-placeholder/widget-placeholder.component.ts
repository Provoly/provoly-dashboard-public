import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseWidgetComponent } from '../base-widget.component';

@Component({
  selector: 'pry-widget-placeholder',
  templateUrl: './widget-placeholder.component.html'
})
export class WidgetPlaceholderComponent extends BaseWidgetComponent {
  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
  }
}
