import { DatePipe, Location } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PrySelectModule } from '@provoly/dashboard';
import { envs } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { EnvironmentActions } from '../store/environment.actions';
import { EnvironmentSelectors } from '../store/environment.selectors';
import { AdminEnvironmentFormComponent } from './admin-environment-form.component';

describe('AdminEnvironmentFormComponent', () => {
  let component: AdminEnvironmentFormComponent;
  let fixture: ComponentFixture<AdminEnvironmentFormComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEnvironmentFormComponent, MockTranslatePipe, MockI18nPipe],
      providers: [
        DatePipe,
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: EnvironmentSelectors.environments,
              value: []
            }
          ]
        })
      ],
      imports: [PrySelectModule, FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnvironmentFormComponent);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.envForm.valid).toBeFalsy();
  });

  it('should create new Environment', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.envForm.setValue(envs[0]);
    component.addEnvironment();
    expect(component.envForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[EnvironmentActions.saveEnvironment({ env: envs[0], route: '/' })]]);
  }));

  it('should update current Environment', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component._currentEnv = envs[0];
    let editedEnv = component._currentEnv;
    expect(editedEnv).toBeDefined();
    editedEnv.value = 'toto';
    component.envForm.setValue(envs[0]);
    component.envForm.patchValue({ value: 'toto' });
    component.addEnvironment();
    expect(component.envForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[EnvironmentActions.saveEnvironment({ env: editedEnv, route: '/' })]]);
  }));

  it('should not update current Environment because value is required', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component._currentEnv = envs[0];
    component.envForm.setValue(envs[0]);
    component.envForm.patchValue({ value: '' });
    component.addEnvironment();
    expect(component.envForm.valid).toEqual(false);
  }));
});
