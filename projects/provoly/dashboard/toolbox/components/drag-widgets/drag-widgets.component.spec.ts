import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ToolboxManifestService, WidgetFactoryService } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockCdkConnectedOverlayDirective } from '../../../mock/directive/mock-cdk-connected-overlay.directive';
import { MockCdkOverlayOriginDirective } from '../../../mock/directive/mock-cdk-overlay-origin.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { DragWidgetsComponent } from './drag-widgets.component';

describe('DragWidgetsComponent', () => {
  let component: DragWidgetsComponent;
  let fixture: ComponentFixture<DragWidgetsComponent>;
  const mockWidgetFactoryService = { resolveComponent: jest.fn(() => DragWidgetsComponent), reference: {} };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DragWidgetsComponent,
        MockPryIconComponent,
        MockTranslatePipe,
        MockCdkOverlayOriginDirective,
        MockCdkConnectedOverlayDirective,
        MockI18nPipe
      ],
      providers: [
        {
          providers: ToolboxManifestService,
          useValue: {
            get: () => {}
          }
        },
        { provide: WidgetFactoryService, useValue: mockWidgetFactoryService },
        provideMockStore({})
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DragWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set correct data transfer', () => {
    const types = [] as string[];
    const data = {} as { [key: string]: any };
    const event = {
      clientX: 456,
      clientY: 328,
      stopPropagation: () => {},
      preventDefault: () => {},
      currentTarget: { contains: () => false },
      dataTransfer: {
        types,
        data,
        setData: (key: string, what: any) => {
          types.push(key);
          data[key] = what;
        },
        getData: (key: string) => data[key] as string
      }
    } as unknown as DragEvent;
    component.dragStart(event, 'table');
    expect(event.dataTransfer?.types).toContain('application/widget-manifest');
    const value = JSON.parse(event.dataTransfer?.getData('application/widget-manifest') ?? '{}');
    expect(value.type).toEqual('table');
  });
});
