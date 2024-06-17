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
import { MockPryAccordionItemComponent } from '@provoly/dashboard/mock/components/mock-pry-accordion-item.component';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';
import { PryRestitutionListComponent } from './restitution-list.component';
import { MockPryAccordionComponent } from '@provoly/dashboard/mock/components/mock-pry-accordion.component';

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
        MockPryIconComponent,
        MockPryAccordionComponent,
        MockPryAccordionItemComponent
      ],
      providers: [
        provideMockStore({}),
        { provide: PryI18nService, useClass: MockPryI18nService },
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
});
