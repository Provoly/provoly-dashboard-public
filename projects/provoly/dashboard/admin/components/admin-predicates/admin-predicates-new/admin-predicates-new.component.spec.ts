import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryPredicatesFormComponent } from '../../../../mock/components/admin/predicates/mock-pry-predicates-form.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { PredicatesSelectors } from '../store/predicates.selectors';
import { AdminPredicatesNewComponent } from './admin-predicates-new.component';

describe('AdminPredicatesNewComponent', () => {
  let component: AdminPredicatesNewComponent;
  let fixture: ComponentFixture<AdminPredicatesNewComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPredicatesNewComponent, MockTranslatePipe, MockPryPredicatesFormComponent, MockI18nPipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: PredicatesSelectors.predicates,
              value: []
            }
          ]
        })
      ],
      imports: [FormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPredicatesNewComponent);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
