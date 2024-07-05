import { Component, OnInit } from '@angular/core';
import { Attribute, BaseTooltipComponent, ClassSelectors, Field, TranslateIdPipe } from '@provoly/dashboard';
import { map, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'pry-attribute-tooltip',
  templateUrl: './attribute-tooltip.component.html'
})
export class AttributeTooltipComponent extends BaseTooltipComponent implements OnInit {
  protected attributes$!: Observable<Attribute[]>;

  constructor(
    private translateIdPipe: TranslateIdPipe,
    private store: Store<any>
  ) {
    super();
    this.context = this.context ?? { attributes: [] };
  }

  ngOnInit() {
    this.attributes$ = this.store.select(ClassSelectors.classes).pipe(
      map((classes) => {
        return classes
          .map((c) => c.attributes)
          .flat()
          .filter((attr) => this.context.attributes.includes(attr.id));
      })
    );
  }

  getValue(attrTechnicalName: string, limit = 9999): Observable<string | number> {
    return this._getValue(attrTechnicalName).pipe(
      withLatestFrom(this.attributes$),
      map(([value, attributes]) => {
        const field = attributes.find((attr) => attr.technicalName === attrTechnicalName)?.field;
        switch (typeof value) {
          case 'undefined':
            return '';
          case 'number':
          case 'string':
            return value;
          default:
            const result = JSON.stringify(value);
            return result.length > limit ? `${result.substring(0, limit)}...` : result;
        }
      })
    );
  }

  // attribute: 'id' | 'oClass' | attributeTechnicalName
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
