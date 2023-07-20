import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { routes } from '../../../admin-routing.module';
import { AdminMetadataUserSelectors } from '../store/admin-metadata-user.selector';
import { AdminUserSelectMetadataComponent } from './admin-user-select-metadata.component';

describe('AdminUserSelectMetadataComponent', () => {
  let component: AdminUserSelectMetadataComponent;
  let fixture: ComponentFixture<AdminUserSelectMetadataComponent>;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserSelectMetadataComponent],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: AdminMetadataUserSelectors.metadata,
              value: []
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserSelectMetadataComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
