import { Component } from '@angular/core';
import { BaseTooltipComponent, Class, ClassSelectors, TranslateIdPipe } from '@provoly/dashboard';
import { map, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-attribute-tooltip',
  templateUrl: './attribute-tooltip.component.html'
})
export class AttributeTooltipComponent extends BaseTooltipComponent {
  private classes$: Observable<Class[]>;

  constructor(private translateIdPipe: TranslateIdPipe, private store: Store<any>) {
    super();
    this.context = this.context ?? { attributes: [] };
    this.classes$ = this.store.select(ClassSelectors.classes);
  }

  getAttributeName(attribute: string): Observable<string> {
    return this.classes$.pipe(
      map(
        (classes) =>
          classes
            .map((clazz) => clazz.attributes)
            .flat()
            .find((attr) => attr.id === attribute)?.name ?? attribute
      )
    );
  }

  getAttributeTechnicalName(attribute: string): Observable<string> {
    return this.classes$.pipe(
      map(
        (classes) =>
          classes
            .map((clazz) => clazz.attributes)
            .flat()
            .find((attr) => attr.id === attribute)?.technicalName ?? attribute
      )
    );
  }

  getValue(attribute: string, limit = 9999): Observable<string> {
    return this.getAttributeTechnicalName(attribute).pipe(
      switchMap((attribute: string) => this._getValue(attribute)),
      map((value) => {
        switch (typeof value) {
          case 'undefined':
            return '';
          case 'number':
            return value.toString();
          case 'string':
            return value;
          default:
            const result = JSON.stringify(value);
            return result.length > limit ? `${result.substring(0, limit)}...` : result;
        }
      })
    );
  }

  _getValue(attribute: string): Observable<string | undefined | number> {
    if (!this.data.item.properties) {
      // This is for Provoly-like items
      switch (attribute) {
        case 'id':
          return of(this.data.item[attribute]);
        case 'oClass':
          return this.translateIdPipe.transform(this.data.item[attribute], {
            type: 'class',
            output: 'name'
          }) as Observable<string>;
        default:
          return of(this.data.item.attributes[attribute]?.value);
      }
    } else {
      // This is for other items, like WMSFeatures
      return of(
        this.data.item.properties.find((prop: { key: string; value: string }) => prop.key === attribute)?.value
      );
    }
  }
}
