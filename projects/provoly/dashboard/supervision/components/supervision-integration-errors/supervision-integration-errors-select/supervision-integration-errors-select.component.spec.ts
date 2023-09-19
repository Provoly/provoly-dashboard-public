import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../mock/components/mock-pry-select.component';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../../mock/pipe/mock-sort.pipe';
import { MockTranslateIdPipe } from '../../../../mock/pipe/mock-translate-id.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { IntegrationError } from '../../../store/supervision-api.model';
import { SupervisionActions } from '../../../store/supervision.actions';
import { SupervisionSelectors } from '../../../store/supervision.selectors';
import { SupervisionIntegrationErrorsSelectComponent } from './supervision-integration-errors-select.component';
import { MockPryTabComponent } from '@provoly/dashboard/mock/components/mock-pry-tab.component';
import { MockPryTabGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-tab-group.component';

describe('SupervisionIntegrationErrorsSelectComponent', () => {
  let component: SupervisionIntegrationErrorsSelectComponent;
  let fixture: ComponentFixture<SupervisionIntegrationErrorsSelectComponent>;
  let store: MockStore<any>;

  const error: IntegrationError = {
    oClass: '534ff6cd-0a85-4612-82c0-7f83e9ce2caa',
    errors: [
      {
        label: 'error1',
        count: 24
      },
      {
        label: 'error2',
        count: 10
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SupervisionIntegrationErrorsSelectComponent,
        MockPrySelectComponent,
        MockNgModelDirective,
        MockSortPipe,
        MockTranslatePipe,
        MockTranslateIdPipe,
        MockPryIconComponent,
        MockI18nPipe,
        MockPryTabComponent,
        MockPryTabGroupComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SupervisionSelectors.currentIntegrationError,
              value: { ...error }
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionIntegrationErrorsSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to close the details panel', () => {
    const spyStore = jest.spyOn(store, 'dispatch');
    const toClick = fixture.debugElement.query(By.css('pry-icon'));
    toClick.nativeElement.click();
    fixture.detectChanges();
    if (SupervisionActions) {
      expect(spyStore.mock.calls).toEqual([
        [SupervisionActions.loadIntegrationErrors()],
        [SupervisionActions.toggleErrorDetails({ error: null, errorDetailsOpen: false })]
      ]);
    }
  });
});
