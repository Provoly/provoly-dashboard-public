import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { WidgetFactoryService } from '@provoly/dashboard';
import { WidgetImageComponent } from '@provoly/dashboard/widgets/widget-image';

import { ToolboxMenuService } from './toolbox-menu.service';

describe('ToolboxMenuService', () => {
  let service: ToolboxMenuService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: WidgetFactoryService, useValue: { resolveComponent: jest.fn(() => WidgetImageComponent) } },
        provideMockStore({})
      ]
    });
    service = TestBed.inject(ToolboxMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
