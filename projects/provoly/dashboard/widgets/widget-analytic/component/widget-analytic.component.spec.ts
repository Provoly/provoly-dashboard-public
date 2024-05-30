import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors, DashboardSelectors, DataSourceSelectors, PryDatasetType } from '@provoly/dashboard';
import { MockTranslatePipe } from '@provoly/dashboard/mock/pipe/mock-translate.pipe';
import { MockPrySelectComponent } from '@provoly/dashboard/mock/components/mock-pry-select.component';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockPryToggleComponent } from '@provoly/dashboard/mock/components/mock-pry-toggle.component';
import { MockPryWidgetHeaderComponent } from '@provoly/dashboard/mock/components/mock-pry-widget-header.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { of } from 'rxjs';
import { WidgetAnalyticComponent } from '@provoly/dashboard/widgets/widget-analytic';
import { MockPryCheckboxComponent } from '@provoly/dashboard/mock/components/mock-pry-checkbox.component';
import { PryWidgetAnalyticCssComponent } from '@provoly/dashboard/widgets/widget-analytic/style/css.component';
import { MockPrySettingsComponent } from '@provoly/dashboard/mock/components/mock-pry-settings.component';
import { hot } from 'jest-marbles';
import { MockDataFormatPipe } from '@provoly/dashboard/mock/pipe/mock-data-format.pipe';

describe('WidgetAnalyticComponent', () => {
  let component: WidgetAnalyticComponent;
  let fixture: ComponentFixture<WidgetAnalyticComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetAnalyticComponent,
        PryWidgetAnalyticCssComponent,
        MockTranslatePipe,
        MockPrySelectComponent,
        MockPryIconComponent,
        MockPryToggleComponent,
        MockPryCheckboxComponent,
        MockPryToggleComponent,
        MockPrySettingsComponent,
        MockPryWidgetHeaderComponent,
        MockI18nPipe,
        MockNgModelDirective,
        MockDataFormatPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.resultSets,
              value: {
                'dataset-dr2': {
                  items: {
                    'class-name': [
                      {
                        id: '1',
                        oClass: 'class-name',
                        attributes: {
                          value: { value: 12, type: 'VALUE', visible: true },
                          primary: { value: 'column1', type: 'VALUE', visible: true },
                          secondary: { value: 'sub column title', type: 'VALUE', visible: true },
                          vertical: { value: 'row title', type: 'VALUE', visible: true },
                          level: { value: 1, type: 'VALUE', visible: true },
                          color: { value: '2', type: 'VALUE', visible: true }
                        }
                      },
                      {
                        id: '2',
                        oClass: 'class-name',
                        attributes: {
                          value: { value: 40, type: 'VALUE', visible: true },
                          primary: { value: 'column2', type: 'VALUE', visible: true },
                          secondary: { value: 'sub column title', type: 'VALUE', visible: true },
                          vertical: { value: 'row title', type: 'VALUE', visible: true },
                          level: { value: 1, type: 'VALUE', visible: true },
                          color: { value: '2', type: 'VALUE', visible: true }
                        }
                      },
                      {
                        id: '3',
                        oClass: 'class-name',
                        attributes: {
                          value: { value: 30, type: 'VALUE', visible: true },
                          primary: { value: 'column3', type: 'VALUE', visible: true },
                          secondary: { value: 'sub column title', type: 'VALUE', visible: true },
                          vertical: { value: 'row title', type: 'VALUE', visible: true },
                          level: { value: 1, type: 'VALUE', visible: true },
                          color: { value: '1', type: 'VALUE', visible: true }
                        }
                      }
                    ]
                  },
                  relations: []
                }
              }
            },
            {
              selector: DataSourceSelectors.datasets,
              value: [
                {
                  id: 'dataset-dr2',
                  name: 'ds',
                  oClass: 'class-id',
                  type: PryDatasetType.CLOSED,
                  metadata: []
                }
              ]
            },
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'class-id',
                  name: 'class-name',
                  attributes: [
                    { id: 'value', name: 'value', technicalName: 'value', field: 'value-xxxx' },
                    { id: 'primary', name: 'primary', technicalName: 'primary', field: 'primary-xxxx' },
                    { id: 'secondary', name: 'secondary', technicalName: 'secondary', field: 'secondary-xxxx' },
                    { id: 'vertical', name: 'vertical', technicalName: 'vertical', field: 'vertical-xxxx' },
                    { id: 'level', name: 'level', technicalName: 'level', field: 'level-xxxx' },
                    { id: 'color', name: 'color', technicalName: 'color', field: 'color' }
                  ]
                }
              ]
            }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAnalyticComponent);
    component = fixture.componentInstance;
    component._manifest$ = of({
      type: 'analytic',
      layout: { x: 1, y: 1, height: 12, width: 12 },
      options: {
        primaryProp: 'primary',
        secondaryProp: 'secondary',
        verticalProp: 'vertical',
        valueProp: 'value',
        colorConfig: {
          prop: 'color',
          colors: ['#FFFFFF', '#000000', '#FEFEFE']
        }
      },
      datasource: 'dataset-dr2'
    });
    component.widgetIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit properties to show in top header row', () => {
    expect(component.primaryProperty$).toBeObservable(
      hot('(a)', {
        a: ['column1', 'column2', 'column3']
      })
    );
  });

  it('should emit properties to show in second header row', () => {
    expect(component.secondaryProperty$).toBeObservable(
      hot('(a)', {
        a: ['sub column title']
      })
    );
  });

  it('should emit properties to show in row labels', () => {
    expect(component.verticalProperty$).toBeObservable(
      hot('(a)', {
        a: ['row title']
      })
    );
  });

  it('should emit a list of table rows', () => {
    expect(component.lines$).toBeObservable(
      hot('(a)', {
        a: [
          {
            name: 'row title',
            value: {
              column1: { 'sub column title': 12 },
              column2: { 'sub column title': 40 },
              column3: { 'sub column title': 30 }
            }
          }
        ]
      })
    );
  });

  it('should emit an object that maps each table cell to a color', () => {
    expect(component.colorMap$).toBeObservable(
      hot('(a)', {
        a: { 'row title': { column1: '#000000', column2: '#000000', column3: '#FFFFFF' } }
      })
    );
  });
});
