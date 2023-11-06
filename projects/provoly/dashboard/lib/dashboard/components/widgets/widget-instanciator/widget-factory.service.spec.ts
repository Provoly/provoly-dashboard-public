import { TestBed } from '@angular/core/testing';

import { WIDGET_DEFINITION, WidgetFactoryService } from './widget-factory.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('WidgetFactoryService', () => {
  let service: WidgetFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WIDGET_DEFINITION, useValue: {} }, provideMockStore({})]
    });
    service = TestBed.inject(WidgetFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
