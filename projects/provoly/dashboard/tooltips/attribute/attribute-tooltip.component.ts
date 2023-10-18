import { Component } from '@angular/core';
import { BaseTooltipComponent, TranslateIdPipe } from '@provoly/dashboard';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'pry-attribute-tooltip',
  templateUrl: './attribute-tooltip.component.html'
})
export class AttributeTooltipComponent extends BaseTooltipComponent {
  constructor(private translateIdPipe: TranslateIdPipe) {
    super();
    this.context = this.context ?? { attributes: [] };
  }

  getValue(attribute: string, limit = 9999): Observable<string> {
    return this._getValue(attribute).pipe(
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
