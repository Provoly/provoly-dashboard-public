import { TestBed } from '@angular/core/testing';

import { WIDGET_DEFINITION, WidgetFactoryService } from './widget-factory.service';

describe('WidgetFactoryService', () => {
  let service: WidgetFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: WIDGET_DEFINITION, useValue: {} }]
    });
    service = TestBed.inject(WidgetFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
