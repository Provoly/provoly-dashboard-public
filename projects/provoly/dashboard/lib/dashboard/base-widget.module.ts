import { NgModule, Type } from '@angular/core';
import { BaseWidgetComponent } from './components/widgets/base-widget.component';
import { WidgetPlaceholderComponent } from './components/widgets/widget-placeholder/widget-placeholder.component';

@NgModule({})
export class BaseWidgetModule {
  getComponent(): Type<BaseWidgetComponent> {
    return WidgetPlaceholderComponent;
  }
}
