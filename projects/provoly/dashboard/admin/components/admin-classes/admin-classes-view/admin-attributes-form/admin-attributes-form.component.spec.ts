import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  Category,
  CategorySelectors,
  ClassSelectors,
  ConfigActions,
  FieldSelectors,
  PRY_ACCESS_GUARD,
  PryDefaultAccessGuard,
  PryI18nService
} from '@provoly/dashboard';
import { of } from 'rxjs';
import { MockPryCheckboxComponent } from '../../../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../../mock/components/mock-pry-select.component';
import { attribute, category, classes, field } from '../../../../../mock/data/mockItemAdmin';
import { MockPryAccessDirective } from '../../../../../mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../../admin-routing.module';
import { AdminClassActions } from '../../store/admin-class.actions';
import { AdminAttributesFormComponent } from './admin-attributes-form.component';

jest.mock('uuid', () => ({ v4: () => 'categoryId' }));

const category1 = { name: 'default', id: '1' } as Category;
const category2 = { name: 'toto', id: '2' } as Category;

describe('AdminAttributesFormComponent', () => {
  let component: AdminAttributesFormComponent;
  let fixture: ComponentFixture<AdminAttributesFormComponent>;
  let store: MockStore<AdminAttributesFormComponent>;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminAttributesFormComponent,
        MockPrySelectComponent,
        MockPryIconComponent,
        MockTranslatePipe,
        MockPryAccessDirective,
        MockPryCheckboxComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: ClassSelectors.classes,
              value: classes
            },
            {
              selector: FieldSelectors.fields,
              value: [field]
            },
            {
              selector: CategorySelectors.categories,
              value: [category1, category2]
            }
          ]
        }),
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        }
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeAll(() => {
    PryI18nService.warn = false;
  });

  afterAll(() => {
    PryI18nService.warn = false;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAttributesFormComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new attribute for selected class', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.selectedClass = classes[0];

    let attributeToSave = {
      ...attribute,
      description: '',
      name: 'attribute-technical' // if no name, the name is the technical name by default
    };

    component.attrForm.setValue(attributeToSave);
    component.addAttribute();
    expect(component.attrForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([
      [AdminClassActions.saveAttributeForClass({ classId: classes[0].id, attribute: attributeToSave, route: '/' })]
    ]);
  }));

  it('should update current attribute', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.selectedClass = classes[0];
    component.selectedAttribute = attribute;
    let attributeToUpdate = {
      ...attribute,
      description: ''
    };
    component.attrForm.setValue(attributeToUpdate);
    attributeToUpdate.name = 'name';
    component.attrForm.patchValue({ name: 'name' });

    component.addAttribute();
    expect(component.attrForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([
      [AdminClassActions.saveAttributeForClass({ classId: classes[0].id, attribute: attributeToUpdate, route: '/' })]
    ]);
  }));

  it('should not update current attribute because technical name is required', fakeAsync(() => {
    component.selectedClass = classes[0];
    component.selectedAttribute = attribute;
    let attributeToUpdate = {
      ...attribute,
      description: ''
    };
    attributeToUpdate.technicalName = '';
    component.attrForm.setValue(attributeToUpdate);
    component.attrForm.patchValue({ technicalName: '' });

    component.addAttribute();
    expect(component.attrForm.valid).toEqual(false);
  }));

  it('should create new category and set to attrForm', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.catToAdd.name = 'default';
    component.addCategory();
    expect(spyStore.mock.calls).toEqual([
      [AdminClassActions.saveCategory({ category: category })],
      [ConfigActions.closeOverlay({ id: 'AdminAttributesFormComponent' })]
    ]);
    expect(component.attrForm.value.category).toEqual(category.id);
    expect(component.catToAdd).toEqual({} as Category);
  }));

  it('should search category ', (done) => {
    component.search({ target: { value: 'to' } });
    component.categories$.subscribe((cat) => {
      expect(cat).toEqual([category2]);
      done();
    });
  });

  it('should close category', () => {
    component.isShowedCategory = true;
    component.closeCategory();
    expect(component.isShowedCategory).toEqual(false);
  });

  it('should set category', () => {
    let category1 = { name: 'default', id: '1' } as Category;
    component.setCategory(category1);
    expect(component.attrForm.value.category).toEqual('1');
  });
});
