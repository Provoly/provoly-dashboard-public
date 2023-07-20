import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockNgModelDirective } from '../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslateIdPipe } from '../../../mock/pipe/mock-translate-id.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { IntegrationError } from '../../store/supervision-api.model';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

import { SupervisionIntegrationErrorsComponent } from './supervision-integration-errors.component';

describe('SupervisionIntegrationErrorsComponent', () => {
  let component: SupervisionIntegrationErrorsComponent;
  let fixture: ComponentFixture<SupervisionIntegrationErrorsComponent>;
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
        SupervisionIntegrationErrorsComponent,
        MockPrySelectComponent,
        MockNgModelDirective,
        MockSortPipe,
        MockTranslatePipe,
        MockTranslateIdPipe,
        MockPryIconComponent,
        MockI18nPipe,
        MockPryCheckboxComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SupervisionSelectors.loading,
              value: false
            },
            {
              selector: SupervisionSelectors.integrationErrors,
              value: new Array(error)
            },
            {
              selector: SupervisionSelectors.currentIntegrationError,
              value: null
            },
            {
              selector: SupervisionSelectors.selectedClasses,
              value: []
            },
            {
              selector: SupervisionSelectors.refreshInterval,
              value: 30000
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionIntegrationErrorsComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total errors', () => {
    expect(component.getTotalErrorCount(error)).toEqual(34);
  });

  it('should toggle the detail panel with selected error', () => {
    const spyToggleDetails = jest.spyOn(component, 'toggleErrorDetails');
    const spyStore = jest.spyOn(store, 'dispatch');
    const toClick = fixture.debugElement.query(By.css('td:nth-child(2)'));
    toClick.nativeElement.click();
    expect(spyToggleDetails.mock.calls).toEqual([[error]]);
    expect(spyStore.mock.calls).toEqual([
      [SupervisionActions?.toggleErrorDetails({ error: error, errorDetailsOpen: true })]
    ]);
  });

  it('should check if class is in the list of selected classes', () => {
    component.selectedClasses = ['1', '2', '534ff6cd-0a85-4612-82c0-7f83e9ce2caa'];
    const isClassSelected = component.isClassSelected(error.oClass);
    expect(isClassSelected).toEqual(true);
  });

  it('should change the refresh interval', () => {
    const spyRefresh = jest.spyOn(component, 'setRefreshInterval');
    const spyStore = jest.spyOn(store, 'dispatch');
    component.setRefreshInterval(25);
    expect(spyRefresh.mock.calls).toEqual([[25]]);
    expect(spyStore.mock.calls).toEqual([
      [SupervisionActions.stopAutoRefresh()],
      [SupervisionActions.setRefreshInterval({ interval: 25 * 1000 })]
    ]);
  });
});
