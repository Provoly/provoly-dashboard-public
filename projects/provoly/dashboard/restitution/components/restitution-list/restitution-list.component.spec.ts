import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { PryI18nService, ToolboxMenuService, ViewMode, Widget } from '@provoly/dashboard';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '@provoly/dashboard/mock/pipe/mock-translate.pipe';
import { MockPryRestitutionListCssComponent } from '@provoly/dashboard/mock/style/mock-pry-restitution-css';
import { WidgetImageComponent } from '@provoly/dashboard/widgets/widget-image';
import { PryRestitutionListComponent } from '../..';

describe('PryRestitutionListComponent', () => {
  let component: PryRestitutionListComponent;
  let fixture: ComponentFixture<PryRestitutionListComponent>;
  const mockWidgetFactoryService = { resolveComponent: jest.fn(() => WidgetImageComponent) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryRestitutionListComponent,
        MockTranslatePipe,
        MockI18nPipe,
        MockPryRestitutionListCssComponent,
        MockPryIconComponent
      ],
      providers: [
        provideMockStore({}),
        { provide: PryI18nService },
        { provide: ToolboxMenuService, useValue: mockWidgetFactoryService }
      ],
      imports: [CommonModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryRestitutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedRestitution to the emitted widget', () => {
    let widget = { id: 'restitution-type', name: 'Custom Widget', type: 'restitution-type' } as unknown as Widget;
    component.selectRestitution(widget);
    expect(component.selectedRestitution).toEqual(widget);
    expect(component.selectedMode).toEqual(component.mode.CONSULT);
  });
  it('should set selectedRestitution to null', () => {
    let widget = { id: 'restitution-type', name: 'Custom Widget', type: 'restitution-type' } as unknown as Widget;
    component.selectRestitution(widget);
    component.closeRestitution();
    expect(component.selectedRestitution).toBeNull();
    expect(component.selectedMode).toEqual(component.mode.CATALOG);
  });

  it('should update selectedMode when selectMode is called', () => {
    expect(component.selectedMode).toBe(ViewMode.CATALOG);
    component.selectMode(ViewMode.CONSULT);
    expect(component.selectedMode).toBe(ViewMode.CONSULT);
  });

  it('should  closeRestitution is called', () => {
    component.selectedRestitution = {} as Widget;
    component.selectedMode = ViewMode.CONSULT;

    component.closeRestitution();

    expect(component.selectedRestitution).toBeNull();
    expect(component.selectedMode).toEqual(ViewMode.CATALOG);
  });
});
