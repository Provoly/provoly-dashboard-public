import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PrySelectModule } from '@provoly/dashboard';
import { links } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { LinksActions } from '../store/links.actions';
import { LinksSelectors } from '../store/links.selectors';
import { AdminLinksNewComponent } from './admin-links-new.component';

describe('AdminLinksNewComponent', () => {
  let component: AdminLinksNewComponent;
  let fixture: ComponentFixture<AdminLinksNewComponent>;
  let store: MockStore<AdminLinksNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminLinksNewComponent, MockTranslatePipe, MockSortPipe, MockI18nPipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: LinksSelectors.links,
              value: []
            }
          ]
        })
      ],
      imports: [PrySelectModule, FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLinksNewComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new Link', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    let link = {
      id: '334c1229-61e7-4807-aeaa-edaf16ec2274',
      relationType: '2f021992-5fb0-42d3-9646-0affccb98105',
      classSource: 'id1',
      attributeSource: { id: '5b9d6408-ec70-461d-921f-88ef6ebb6cf6' },
      attributeDestination: { id: '3010e2c4-ef24-40fb-a72b-6757df8017f0' },
      classDestination: 'id2'
    };
    component.linkForm.setValue(link);
    component.addLink();
    expect(component.linkForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[LinksActions.saveLink({ link: links[0], route: '/' })]]);
  }));
});
