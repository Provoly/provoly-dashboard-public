import { Component } from '@angular/core';
import { BaseTooltipComponent, TranslateIdPipe } from '@provoly/dashboard';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'pry-attribute-tooltip',
  templateUrl: './attribute-tooltip.component.html'
})
export class AttributeTooltipComponent extends BaseTooltipComponent {
  constructor(private translateIdPipe: TranslateIdPipe) {
    super();
    this.context = this.context ?? { attributes: [] };
  }

  getValue(attribute: string): Observable<string> {
    switch (attribute) {
      case 'id':
        return of(this.data.item[attribute]);
      case 'oClass':
        return this.translateIdPipe.transform(this.data.item[attribute], {
          type: 'class',
          output: 'name'
        }) as Observable<string>;
      default:
        return of((this.data.item.attributes[attribute]?.value ?? '') as string);
    }
  }
}
