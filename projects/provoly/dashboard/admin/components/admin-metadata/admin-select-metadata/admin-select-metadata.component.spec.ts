import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { MetadataSelectors } from '../store/metadata.selector';
import { AdminSelectMetadataComponent } from './admin-select-metadata.component';

describe('AdminSelectImetadataComponent', () => {
  let component: AdminSelectMetadataComponent;
  let fixture: ComponentFixture<AdminSelectMetadataComponent>;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSelectMetadataComponent, MockTranslatePipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: MetadataSelectors.metadata,
              value: []
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSelectMetadataComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
