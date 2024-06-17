import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  Category,
  CategorySelectors,
  ClassSelectors,
  FieldSelectors,
  PRY_ACCESS_GUARD,
  PryDefaultAccessGuard,
  PryI18nService
} from '@provoly/dashboard';
import { MockPryCheckboxComponent } from '../../../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../../mock/components/mock-pry-select.component';
import { attribute, classes, field } from '../../../../../mock/data/mockItemAdmin';
import { MockPryAccessDirective } from '../../../../../mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../../admin-routing.module';
import { AdminClassActions } from '../../store/admin-class.actions';
import { AdminAttributesFormComponent } from './admin-attributes-form.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

jest.mock('uuid', () => ({ v4: () => 'categoryId' }));

const category1 = { name: 'default', id: '1' } as Category;
const category2 = { name: 'toto', id: '2' } as Category;

describe('AdminAttributesFormComponent', () => {
  let component: AdminAttributesFormComponent;
  let fixture: ComponentFixture<AdminAttributesFormComponent>;
  let store: MockStore<AdminAttributesFormComponent>;

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
        { provide: PryI18nService, useClass: MockPryI18nService },
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
        { provide: Overlay, useValue: MockOverlay }
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
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

  it('should create new attribute for selected class', () => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.selectedClass = classes[0];

    let attributeToSave = {
      ...attribute,
      description: ''
    };

    component.attrForm.setValue(attributeToSave);
    component.addAttribute();
    expect(component.attrForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([
      [AdminClassActions.saveAttributeForClass({ classId: classes[0].id, attribute: attributeToSave, route: '/' })]
    ]);
  });

  it('should update current attribute', () => {
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
  });

  it('should not update current attribute because technical name is required', () => {
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
  });
});
