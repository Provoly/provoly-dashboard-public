import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PryI18nService } from '@provoly/dashboard';
import { MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { metadata } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminMetadataComponent } from './admin-metadata.component';
import { PryListMetadataModule } from './shared/list-metadata/list-metadata.module';

describe('AdminMetadataComponent', () => {
  PryI18nService.warn = false;
  let component: AdminMetadataComponent;
  let fixture: ComponentFixture<AdminMetadataComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMetadataComponent, MockSortPipe, MockTranslatePipe, MockI18nPipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: MetadataSelectors.metadata,
              value: metadata
            }
          ]
        })
      ],
      imports: [PryListMetadataModule, FormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMetadataComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
