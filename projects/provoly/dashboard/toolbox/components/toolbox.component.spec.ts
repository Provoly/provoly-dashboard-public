import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryEditModeToggleComponent } from '../../mock/components/mock-pry-edit-mode-toggle.component';
import { MockPryIconComponent } from '../../mock/components/mock-pry-icon.component';
import { MockPryNamedQueryComponent } from '../../mock/components/mock-pry-named-query.component';
import { MockCdkConnectedOverlayDirective } from '../../mock/directive/mock-cdk-connected-overlay.directive';
import { MockCdkOverlayOriginDirective } from '../../mock/directive/mock-cdk-overlay-origin.directive';
import { MockPryAccessDirective } from '../../mock/directive/mock-pry-access.directive';
import { MockTranslatePipe } from '../../mock/pipe/mock-translate.pipe';
import { ToolboxComponent } from './toolbox.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('ToolboxComponent', () => {
  let component: ToolboxComponent;
  let fixture: ComponentFixture<ToolboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ToolboxComponent,
        MockPryEditModeToggleComponent,
        MockPryIconComponent,
        MockPryNamedQueryComponent,
        MockTranslatePipe,
        MockPryAccessDirective,
        MockCdkConnectedOverlayDirective,
        MockCdkOverlayOriginDirective
      ],
      providers: [provideMockStore({ initialState: {} }), { provide: Overlay, useValue: MockOverlay }]
    }).compileComponents();
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
