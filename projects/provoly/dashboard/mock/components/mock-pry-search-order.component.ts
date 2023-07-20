// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, HostBinding } from '@angular/core';
import { Attribute, Class, Field, ResultOrder } from '@provoly/dashboard';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'pry-search-order',
  template: '<p>Mock</p>'
})
export class MockPrySearchOrderComponent {
  @HostBinding('class') class = 'o-pry-search-order-wrapper';
  @HostBinding('class.is-hover') hover = false;
  masterId$: Observable<string | null> = new Subject();
  monoClassId$: Observable<string | undefined> = new Subject();
  classes$: Observable<Class[]> = new Subject();
  variableAttributes$: Observable<Attribute[]> = new Subject();
  order$: Observable<ResultOrder | undefined> = new Subject();
  fields$: Observable<Field[]> = new Subject();
}
