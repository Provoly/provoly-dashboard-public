import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryFilterSettingsComponent } from '@provoly/dashboard/mock/components/mock-pry-filter-settings.component';
import { MockPrySelectGridLayoutComponent } from '@provoly/dashboard/mock/components/mock-pry-select-grid-layout.component';
import { MockPryClearViewComponent } from '../../mock/components/mock-pry-clear-view.component';
import { MockPryDragWidgetsComponent } from '../../mock/components/mock-pry-drag-widgets.component';
import { MockPryEditModeToggleComponent } from '../../mock/components/mock-pry-edit-mode-toggle.component';
import { MockPryIconComponent } from '../../mock/components/mock-pry-icon.component';
import { MockPryLaunchTabComponent } from '../../mock/components/mock-pry-launch-tab.component';
import { MockPryNamedQueryComponent } from '../../mock/components/mock-pry-named-query.component';
import { MockPrySaveViewComponent } from '../../mock/components/mock-pry-save-view.component';
import { MockPryAccessDirective } from '../../mock/directive/mock-pry-access.directive';
import { MockTranslatePipe } from '../../mock/pipe/mock-translate.pipe';

import { ToolboxComponent } from './toolbox.component';

describe('ToolboxComponent', () => {
  let component: ToolboxComponent;
  let fixture: ComponentFixture<ToolboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ToolboxComponent,
        MockPryIconComponent,
        MockPryNamedQueryComponent,
        MockPrySaveViewComponent,
        MockTranslatePipe,
        MockPryEditModeToggleComponent,
        MockPryLaunchTabComponent,
        MockPryDragWidgetsComponent,
        MockPryAccessDirective,
        MockPryClearViewComponent,
        MockPrySelectGridLayoutComponent,
        MockPryFilterSettingsComponent
      ],
      providers: [provideMockStore({ initialState: {} })]
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
