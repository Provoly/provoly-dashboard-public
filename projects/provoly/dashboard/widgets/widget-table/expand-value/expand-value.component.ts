import { Component, Input } from '@angular/core';
import { Field, MultiMultipointValue, MultipointValue, PointValue, ValueType } from '@provoly/dashboard';

@Component({
  selector: 'pry-expand-value',
  templateUrl: './expand-value.component.html'
})
export class ExpandValueComponent {
  isArray: boolean = false;
  firstValue?: string | number | PointValue | MultipointValue | MultiMultipointValue | ValueType[] | null | undefined;
  rest: (string | number | PointValue | MultipointValue | MultiMultipointValue | ValueType[] | null | undefined)[] = [];
  isNumber = false;

  @Input() field?: Field;
  @Input() set value(toDisplay: ValueType | ValueType[] | null) {
    if (Array.isArray(toDisplay) && toDisplay.length > 1) {
      this.isArray = true;
      const [firstValue, ...rest] = toDisplay;
      this.firstValue = firstValue;
      this.rest = rest;
    } else {
      this.isArray = false;
      this.firstValue = toDisplay;
      this.rest = [];
      this.isNumber = typeof this.firstValue === 'number';
    }
  }
}
