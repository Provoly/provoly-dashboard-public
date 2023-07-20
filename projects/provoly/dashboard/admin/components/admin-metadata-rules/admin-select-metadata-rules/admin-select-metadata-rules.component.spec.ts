import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { MetadataRulesSelectors } from '../store/metadata-rules.selectors';
import { AdminSelectMetadataRulesComponent } from './admin-select-metadata-rules.component';

describe('AdminSelectMetadataRulesComponent', () => {
  let component: AdminSelectMetadataRulesComponent;
  let fixture: ComponentFixture<AdminSelectMetadataRulesComponent>;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminSelectMetadataRulesComponent, MockTranslatePipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: MetadataRulesSelectors.metadataRulesList,
              value: []
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSelectMetadataRulesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
