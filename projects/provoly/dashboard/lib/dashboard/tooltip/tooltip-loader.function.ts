import { createNgModule, Injector, Type } from '@angular/core';
import { DefaultTooltipComponent } from './components/default/default.tooltip.component';
import { BaseTooltipComponent } from './base-tooltip.component';
import { BaseTooltipModule } from './base-tooltip.module';

const moduleRefCache = {} as { [moduleName: string]: BaseTooltipModule };

export function tooltipLoader(module: any, prop: string): (injector: Injector) => Type<BaseTooltipComponent> {
  return (injector: Injector) => {
    if (!!moduleRefCache[prop]) {
      return moduleRefCache[prop].getComponent() as unknown as Type<BaseTooltipComponent>;
    } else {
      if (module.hasOwnProperty(prop)) {
        const moduleRef = createNgModule(module[prop], Injector.create({ parent: injector, providers: [] }));
        moduleRefCache[prop] = moduleRef.instance as BaseTooltipModule;
        return moduleRefCache[prop].getComponent() as unknown as Type<BaseTooltipComponent>;
      } else {
        console.error(`module has no property ${prop}`, module);
        return DefaultTooltipComponent;
      }
    }
  };
}
