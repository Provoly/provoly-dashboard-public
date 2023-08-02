import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CatalogEntry, DashboardActions, PryI18nService, ToolboxMenuService, Widget } from '@provoly/dashboard';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '@provoly/dashboard/mock/pipe/mock-translate.pipe';
import { MockPryRestitutionListCssComponent } from '@provoly/dashboard/mock/style/mock-pry-restitution-css';
import { WidgetImageComponent } from '@provoly/dashboard/widgets/widget-image';
import { PryRestitutionListComponent } from '../..';
import { PryRestitutionListItemComponent } from './restitution-list-item.component';
import { MockGetSecuredImagePipe } from '@provoly/dashboard/mock/pipe/mock-get-secured-image.pipe';

const catalogEntry = {
  icon: '',
  label: '',
  category: 'test-test',
  type: 'restitution-type',
  description: 'test du dredi',
  isCustom: true
} as CatalogEntry;

describe('PryRestitutionListItemComponent', () => {
  let component: PryRestitutionListItemComponent;
  let fixture: ComponentFixture<PryRestitutionListItemComponent>;
  const mockWidgetFactoryService = { resolveComponent: jest.fn(() => WidgetImageComponent) };
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryRestitutionListComponent,
        MockTranslatePipe,
        MockI18nPipe,
        MockPryRestitutionListCssComponent,
        MockPryIconComponent,
        PryRestitutionListItemComponent,
        MockGetSecuredImagePipe
      ],
      providers: [
        provideMockStore({}),
        { provide: PryI18nService },
        { provide: ToolboxMenuService, useValue: mockWidgetFactoryService }
      ],
      imports: [CommonModule, FormsModule]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  describe('base', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PryRestitutionListItemComponent);
      component = fixture.componentInstance;
      component.widget = catalogEntry;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should call viewInDashboard', () => {
      const widget: CatalogEntry = { icon: '', label: '', type: 'test', isCustom: false };
      const spy = jest.spyOn(store, 'dispatch');
      component.viewInDashboard(widget);
      expect(spy).toHaveBeenCalledWith(DashboardActions.addWidgetToPresentation({ widgetType: widget.type }));
    });
  });

  describe('restitution emitter - input 1', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PryRestitutionListItemComponent);
      component = fixture.componentInstance;
      component.widget = {
        icon: '',
        label: '',
        category: 'test-test',
        type: 'restitution-type',
        description: 'test du dredi',
        isCustom: false
      } as CatalogEntry;
      fixture.detectChanges();
    });

    it("should not emit selected restitution if it's not custom (if it's a model)", () => {
      const getSpy = jest.spyOn(component.selectRestitution, 'emit');
      component.emitSelectedRestitution(catalogEntry);
      expect(getSpy).not.toHaveBeenCalled();
    });
  });

  describe('restitution emitter - input 2', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PryRestitutionListItemComponent);
      component = fixture.componentInstance;
      component.widget = {
        icon: '',
        label: '',
        category: 'test-test',
        type: 'restitution-type',
        description: 'test du dredi',
        isCustom: true
      } as CatalogEntry;
      fixture.detectChanges();
    });

    it("should emit selected restitution if it's custom", () => {
      const getSpy = jest.spyOn(component.selectRestitution, 'emit');
      component.catalog = [
        { id: 'restitution-type', name: 'Custom Widget', type: 'restitution-type' } as unknown as Widget
      ];
      component.emitSelectedRestitution(catalogEntry);
      expect(getSpy).toHaveBeenCalledWith(component.catalog[0]);
    });
  });
});
