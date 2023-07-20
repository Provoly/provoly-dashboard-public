import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataSourceSelectors, PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminSelectDatasetComponent } from './admin-select-dataset.component';

describe('AdminSelectDatasetComponent', () => {
  let component: AdminSelectDatasetComponent;
  let fixture: ComponentFixture<AdminSelectDatasetComponent>;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSelectDatasetComponent, MockTranslatePipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: DataSourceSelectors.datasets,
              value: []
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSelectDatasetComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
