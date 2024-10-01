import { createNgModule, Injector, Type } from '@angular/core';
import { WidgetPlaceholderComponent } from './components/widgets/widget-placeholder/widget-placeholder.component';
import { BaseWidgetModule } from './base-widget.module';
import { BaseWidgetComponent } from './components/widgets/base-widget.component';

const moduleRefCache = {} as { [moduleName: string]: BaseWidgetModule };
const standaloneRefCache = {} as { [moduleName: string]: BaseWidgetComponent };

export function widgetLoader(module: any, prop: string): (injector: Injector) => Type<BaseWidgetComponent> {
  return (injector: Injector) => {
    const standalone = prop.endsWith('Component');
    if (!!moduleRefCache[prop]) {
      return moduleRefCache[prop].getComponent() as unknown as Type<BaseWidgetComponent>;
    } else if (!!standaloneRefCache[prop]) {
      return standaloneRefCache[prop] as unknown as Type<BaseWidgetComponent>;
    } else {
      if (!!module[prop]) {
        if (!standalone) {
          const moduleRef = createNgModule(module[prop], Injector.create({ parent: injector, providers: [] }));
          moduleRefCache[prop] = moduleRef.instance as BaseWidgetModule;
          return moduleRefCache[prop].getComponent() as unknown as Type<BaseWidgetComponent>;
        } else {
          standaloneRefCache[prop] = module[prop];
          return standaloneRefCache[prop] as unknown as Type<BaseWidgetComponent>;
        }
      } else {
        console.error(`module has no property ${prop}`, module);
        return WidgetPlaceholderComponent;
      }
    }
  };
}
