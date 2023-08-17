import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Overlay } from '@angular/cdk/overlay';
import { of } from 'rxjs';
import { ToolboxComponent } from './toolbox.component';
import { MockPryEditModeToggleComponent } from '../../mock/components/mock-pry-edit-mode-toggle.component';
import { MockPryIconComponent } from '../../mock/components/mock-pry-icon.component';
import { MockPryNamedQueryComponent } from '../../mock/components/mock-pry-named-query.component';
import { MockPryAccessDirective } from '../../mock/directive/mock-pry-access.directive';
import { MockTranslatePipe } from '../../mock/pipe/mock-translate.pipe';
import { MockCdkOverlayOriginDirective } from '../../mock/directive/mock-cdk-overlay-origin.directive';
import { MockCdkConnectedOverlayDirective } from '../../mock/directive/mock-cdk-connected-overlay.directive';

describe('ToolboxComponent', () => {
  let component: ToolboxComponent;
  let fixture: ComponentFixture<ToolboxComponent>;
  let overlay: Overlay;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ToolboxComponent,
        MockPryEditModeToggleComponent,
        MockPryIconComponent,
        MockPryNamedQueryComponent,
        MockTranslatePipe,
        MockPryEditModeToggleComponent,
        MockPryAccessDirective,
        MockCdkConnectedOverlayDirective,
        MockCdkOverlayOriginDirective
      ],
      providers: [
        provideMockStore({ initialState: {} }),
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        }
      ]
    }).compileComponents();
    overlay = TestBed.inject(Overlay);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
