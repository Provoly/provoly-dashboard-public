import { createNgModule, Injector, Type } from '@angular/core';
import { BaseFilterModule } from './base-filter.module';
import { BaseFilterComponent } from './base-filter.component';

const moduleRefCache = {} as { [moduleName: string]: BaseFilterModule };

export function filterLoader(module: any, prop: string): (injector: Injector) => Type<BaseFilterComponent> {
  return (injector: Injector) => {
    if (!!moduleRefCache[prop]) {
      return moduleRefCache[prop].getComponent() as unknown as Type<BaseFilterComponent>;
    } else {
      if (module.hasOwnProperty(prop)) {
        const moduleRef = createNgModule(module[prop], Injector.create({ parent: injector, providers: [] }));
        moduleRefCache[prop] = moduleRef.instance as BaseFilterModule;
        return moduleRefCache[prop].getComponent() as unknown as Type<BaseFilterComponent>;
      } else {
        console.error(`module has no property ${prop}`, module);
        throw new Error(`module ${module} has no property ${prop}`);
      }
    }
  };
}
