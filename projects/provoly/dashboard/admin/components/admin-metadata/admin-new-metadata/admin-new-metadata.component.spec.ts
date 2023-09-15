import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { MockPryMetadataFormComponent } from '../../../../mock/components/admin/metadata/mock-pry-metadata-form.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminNewMetadataComponent } from './admin-new-metadata.component';

describe('AdminNewMetadataComponent', () => {
  let component: AdminNewMetadataComponent;
  let fixture: ComponentFixture<AdminNewMetadataComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNewMetadataComponent, MockTranslatePipe, MockPryMetadataFormComponent, MockI18nPipe],
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
      imports: [FormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewMetadataComponent);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    router.navigate(['metadata/new']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
