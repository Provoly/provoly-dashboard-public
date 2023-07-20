import { Injector, Type } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget.component';

export type WidgetStaticDefinition = {
  name: string;
  component: Type<BaseWidgetComponent>;
};
export type WidgetLazyDefinition = {
  name: string;
  load: () => Promise<(injector: Injector) => Type<BaseWidgetComponent>>;
};
export type WidgetDefinition = WidgetStaticDefinition | WidgetLazyDefinition;
