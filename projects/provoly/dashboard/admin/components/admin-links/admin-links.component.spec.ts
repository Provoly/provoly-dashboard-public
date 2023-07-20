import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { links } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminLinksComponent } from './admin-links.component';
import { LinksSelectors } from './store/links.selectors';

describe('AdminLinksComponent', () => {
  let component: AdminLinksComponent;
  let fixture: ComponentFixture<AdminLinksComponent>;
  let store: MockStore<AdminLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLinksComponent, MockTranslatePipe, MockSortPipe, MockI18nPipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: LinksSelectors.links,
              value: links
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLinksComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
