import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { combineLatest, filter, from, map, mergeMap, Observable, of } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';
import { Class } from '../../store/class/class.interface';
import { ClassSelectors } from '../../store/class/class.selectors';
import { ConfigSelectors } from '../../store/config/config.selectors';
import { IconDefinitions } from '../../store/config/icon-definitions.interface';
import { DataSource, NamedQuery } from '../../store/data-source/data-source.model';
import { DataSourceSelectors } from '../../store/data-source/data-source.selectors';
import { NamedQueryTypes } from '../../store/data-source/named-query-types.model';
import { Field } from '../../store/field/field.interface';
import { FieldSelectors } from '../../store/field/field.selectors';
import { ImageService } from '../../store/image/image.service';
import { DEFAULT_NAMED_QUERY_ID } from '../../store/search/search.constants';
import { SymbolService } from '../../symbol/symbol.service';

export const UNKNOWN_DATASOURCE = (id: string) =>
  ({
    id: id,
    color: '#FFFFFF',
    name: id,
    request: { fullSearch: { value: '???' } }
  } as NamedQuery);

@Pipe({
  name: 'translateId'
})
export class TranslateIdPipe implements PipeTransform {
  constructor(
    private store: Store<any>,
    private translateService: PryI18nService,
    private imageService: ImageService,
    private symbolService: SymbolService
  ) {}

  transform(value: string | string[], ...args: unknown[]): Observable<string | string[] | SafeUrl | null> {
    const config = args[0] as
      | { type: 'field' }
      | { type: 'class'; output: 'icon' | 'name' }
      | { type: 'datasource'; output: 'name' | 'color' }
      | { type: 'datasource'; output: 'icon'; noDefault?: boolean };
    switch (config.type) {
      case 'field':
        return this.store
          .select(FieldSelectors.fields)
          .pipe(map((fields: Field[]) => fields?.find((f) => f.id === value)?.name ?? value));
      case 'class':
        if (config.output === 'icon') {
          return from(this.symbolService.getSymbolOfClass(<string>value));
        } else {
          return this.store
            .select(ClassSelectors.classes)
            .pipe(map((classes: Class[]) => classes?.find((cl) => cl.id === value)?.name ?? value));
        }
      case 'datasource':
        const valueAsArray: string[] = typeof value === 'string' ? [value as string] : (value as unknown as string[]);

        switch (config.output) {
          case 'name':
            return this.store
              .select(DataSourceSelectors.getDataSources)
              .pipe(
                map((datasources) =>
                  valueAsArray.map((value) =>
                    value === DEFAULT_NAMED_QUERY_ID
                      ? this.translateService.instant('@pry.widget.namedQuery.defaultRs')
                      : datasources.find((nq) => nq.id === value)?.name ?? value
                  )
                )
              );
          case 'color':
            return this.store
              .select(DataSourceSelectors.getNamedQuery)
              .pipe(
                map((nqs) => valueAsArray.map((value) => nqs.list.find((nq) => nq.id === value)?.color ?? '#FFFFFF'))
              );
          case 'icon':
            return combineLatest([
              this.store.select(DataSourceSelectors.getDataSources),
              this.store.select(ConfigSelectors.iconDefinitions),
              this.store.select(ClassSelectors.classes)
            ]).pipe(
              map(
                ([dss, iconDefs, classes]) =>
                  [
                    (valueAsArray ?? []).map((value) => {
                      return dss.find((ds) => ds.id === value) ?? UNKNOWN_DATASOURCE(value);
                    })[0],
                    iconDefs,
                    classes
                  ] as [DataSource, IconDefinitions, Class[]]
              ),
              filter(([oDs, iconDefs, classes]) => !!oDs),
              map(([oDs, iconDefs, classes]) => {
                if (oDs.sourceType === 'dataset') {
                  return {
                    promise: this.symbolService.getSymbolOfClass(oDs.oClass, config.noDefault),
                    url: ''
                  };
                }
                if (oDs.request) {
                  switch (oDs.request.type) {
                    case NamedQueryTypes.MONO_CLASS:
                      return {
                        promise: this.symbolService.getSymbolOfClass(oDs.request.oClass, config.noDefault),
                        url: ''
                      };
                    default:
                      if (oDs.request.fullSearch) {
                        return { promise: null, url: 'assets/svgs/save-line.svg' };
                      } else {
                        return {
                          promise: null,
                          url: oDs.request.type === NamedQueryTypes.MULTI_CLASS ? 'assets/svgs/save-line.svg' : ''
                        };
                      }
                  }
                } else {
                  return { promise: null, url: '' };
                }
              }),
              mergeMap((info) => {
                if (info.promise) {
                  return from(info.promise);
                }
                return of(info.url);
              })
            );
        }
    }
    return of(value);
  }
}
