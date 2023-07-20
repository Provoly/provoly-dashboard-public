import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { PRY_DIALOG_DATA, PryDialogRef } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockNgModelDirective } from '../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { PrySaveQueryComponent } from './save-query.component';

describe('SaveQueryComponent', () => {
  let component: PrySaveQueryComponent;
  let fixture: ComponentFixture<PrySaveQueryComponent>;
  let store: Store;
  let dialog: PryDialogRef<PrySaveQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySaveQueryComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockNgModelDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({}),
        {
          provide: PryDialogRef,
          useValue: {
            close: () => {}
          }
        },
        { provide: PRY_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    dialog = TestBed.inject(PryDialogRef);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySaveQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
