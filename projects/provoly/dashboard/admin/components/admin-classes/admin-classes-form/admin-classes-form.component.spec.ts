import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors, FIELD_UUID, PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { classes } from '../../../../mock/data/mockItemAdmin';
import { MockPryAccessDirective } from '../../../../mock/directive/mock-pry-access.directive';
import { MockGetSecuredImagePipe } from '../../../../mock/pipe/mock-get-secured-image.pipe';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslateIdPipe } from '../../../../mock/pipe/mock-translate-id.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminClassActions } from '../store/admin-class.actions';

import { AdminClassesFormComponent } from './admin-classes-form.component';
import { MockPrySelectComponent } from '@provoly/dashboard/mock/components/mock-pry-select.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';
import { mockClasses } from '@provoly/dashboard/mock/data/mockModel';

jest.mock('uuid', () => ({ v4: () => 'adfd01fb-309b-4e1c-9117-44d003f5d7fc' }));

describe('AdminClassesFormComponent', () => {
  let component: AdminClassesFormComponent;
  let fixture: ComponentFixture<AdminClassesFormComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminClassesFormComponent,
        MockTranslatePipe,
        MockPryAccessDirective,
        MockTranslateIdPipe,
        MockGetSecuredImagePipe,
        MockPrySelectComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: ClassSelectors.classes,
              value: classes
            }
          ]
        }),
        { provide: Overlay, useValue: MockOverlay }
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassesFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new class', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');

    let classe = {
      id: 'idLieu',
      name: 'lieu',
      description: '',
      storage: 'ELASTIC'
    };
    let resultClass = {
      ...classe,
      attributes: []
    };
    component.classForm.setValue(classe);
    component.addClass();
    expect(component.classForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[AdminClassActions.saveInterClass({ class: resultClass, route: '/idLieu' })]]);
  }));

  it('should update current class', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component._currentClass = mockClasses[0];

    let editedClass = component._currentClass;
    editedClass.name = 'endroit';

    component.classForm.patchValue({ name: 'endroit' });

    component.addClass();
    expect(component.classForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[AdminClassActions.saveClass({ class: editedClass, route: '/' })]]);
  }));

  it('should not update current class because name is required', fakeAsync(() => {
    component._currentClass = mockClasses[0];

    let editedClass = component._currentClass;
    editedClass.name = '';

    component.classForm.patchValue({ name: '' });

    component.addClass();
    expect(component.classForm.valid).toEqual(false);
  }));
});
