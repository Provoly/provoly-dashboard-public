import { createNgModule, Injector, Type } from '@angular/core';
import { DefaultTooltipComponent } from './components/default/default.tooltip.component';
import { BaseTooltipComponent } from './base-tooltip.component';
import { BaseTooltipModule } from './base-tooltip.module';

const moduleRefCache = {} as { [moduleName: string]: BaseTooltipModule };
const standaloneRefCache = {} as { [moduleName: string]: BaseTooltipComponent };

export function tooltipLoader(module: any, prop: string): (injector: Injector) => Type<BaseTooltipComponent> {
  return (injector: Injector) => {
    const standalone = prop.endsWith('Component');
    if (!!moduleRefCache[prop]) {
      return moduleRefCache[prop].getComponent() as unknown as Type<BaseTooltipComponent>;
    } else if (!!standaloneRefCache[prop]) {
      return standaloneRefCache[prop] as unknown as Type<BaseTooltipComponent>;
    } else {
      if (!!module[prop]) {
        if (!standalone) {
          const moduleRef = createNgModule(module[prop], Injector.create({ parent: injector, providers: [] }));
          moduleRefCache[prop] = moduleRef.instance as BaseTooltipModule;
          return moduleRefCache[prop].getComponent() as unknown as Type<BaseTooltipComponent>;
        } else {
          standaloneRefCache[prop] = module[prop];
          return standaloneRefCache[prop] as unknown as Type<BaseTooltipComponent>;
        }
      } else {
        console.error(`module has no property ${prop}`, module);
        return DefaultTooltipComponent;
      }
    }
  };
}
