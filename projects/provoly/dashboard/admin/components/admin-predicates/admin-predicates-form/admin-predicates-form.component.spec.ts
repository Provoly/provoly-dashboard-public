import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { of } from 'rxjs';
import { MockPryModalComponent } from '../../../../mock/components/mock-pry-modal.component';
import { preds } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminService } from '../../../store/admin.service';
import { PredicatesActions } from '../store/predicates.actions';
import { PredicatesSelectors } from '../store/predicates.selectors';
import { AdminPredicatesFormComponent } from './admin-predicates-form.component';

describe('AdminPredicatesFormComponent', () => {
  let component: AdminPredicatesFormComponent;
  let fixture: ComponentFixture<AdminPredicatesFormComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPredicatesFormComponent, MockTranslatePipe, MockPryModalComponent, MockI18nPipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: PredicatesSelectors.predicates,
              value: []
            }
          ]
        }),
        {
          provide: AdminService,
          useValue: {
            postMetadata: () => of(null)
          }
        }
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPredicatesFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.predForm.valid).toBeFalsy();
  });

  it('should create new Predicate', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');

    component.predForm.setValue(preds[0]);
    component.addPredicate();

    expect(component.predForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[PredicatesActions.savePredicate({ predicate: preds[0], route: '/' })]]);
  }));

  it('should update current Predicate', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component._currentPred = preds[0];
    component.predForm.setValue(preds[0]);
    let editedPred = preds[0];
    editedPred.name = 'toto';
    component.predForm.patchValue({ name: 'toto' });
    component.addPredicate();

    expect(component.predForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[PredicatesActions.savePredicate({ predicate: editedPred, route: '/' })]]);
  }));

  it('should not update current Predicate because name is required', fakeAsync(() => {
    component._currentPred = preds[0];
    component.predForm.setValue(preds[0]);
    component.predForm.patchValue({ name: '' });
    component.addPredicate();

    expect(component.predForm.valid).toEqual(false);
  }));
});
