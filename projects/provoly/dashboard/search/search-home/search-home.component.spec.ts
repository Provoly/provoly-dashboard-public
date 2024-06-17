import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPrySearchCssComponent } from '@provoly/dashboard/mock/style/mock-pry-search-css';
import { MockPryIconComponent } from '../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../mock/pipe/mock-translate.pipe';
import { PrySearchHomeComponent } from './search-home.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('PrySearchHomeComponent', () => {
  let component: PrySearchHomeComponent;
  let store: Store;
  let fixture: ComponentFixture<PrySearchHomeComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySearchHomeComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockI18nPipe,
        MockPrySearchCssComponent
      ],
      providers: [provideMockStore({}), { provide: Overlay, useValue: MockOverlay }]
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
