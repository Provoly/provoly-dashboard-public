import { Overlay } from '@angular/cdk/overlay';
import { Injector, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ClassSelectors,
  ConfigActions,
  DashboardActions,
  DashboardSelectors,
  DataSourceSelectors,
  Field,
  FieldSelectors,
  FieldType,
  Filter,
  FilterFactoryService
} from '@provoly/dashboard';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';
import { MockPryToolboxCssComponent } from '@provoly/dashboard/mock/style/mock-pry-toolbox-css';
import { mapUtilsData } from '@provoly/dashboard/widgets/widget-map/utils/widget-map.utils.spec';
import { hot } from 'jest-marbles';
import { of } from 'rxjs';
import { v4 } from 'uuid';
import { namedQueryList } from '../../../lib/core/store/data-source/data-source.effects.spec';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockPrySelectGridLayoutCssComponent } from '../../../mock/style/mock-pry-select-grid-layout-css';
import { Attribute, FilterSteps, PryFilterSettingsComponent } from './filter-settings.component';

const emptyFilter = {
  id: v4(),
  name: '',
  type: '',
  attributes: []
};

const filter: Filter = {
  id: 'test-id',
  name: 'test-filter',
  type: 'list',
  attributes: []
};

const attributes: Attribute[] = [
  {
    id: '1',
    technicalName: 'string-attr',
    label: 'string-attr / ds / class',
    datasource: 'ds-id',
    type: FieldType.STRING
  },
  {
    id: '2',
    technicalName: 'date-attr',
    label: 'date-attr / ds / class',
    datasource: 'ds-id',
    type: FieldType.INSTANT
  },
  {
    id: '3',
    technicalName: 'number-attr',
    label: 'number-attr / ds / class',
    datasource: 'ds-id',
    type: FieldType.INTEGER
  },
  { id: '4', technicalName: 'other-attr', label: 'other-attr / ds / class', datasource: 'ds-id', type: FieldType.RAW },
  {
    id: '5',
    technicalName: 'string-attr2',
    label: 'string-attr2 / ds / class',
    datasource: 'ds-id',
    type: FieldType.STRING
  }
];

describe('FilterSettingsComponent', () => {
  let store: MockStore;
  let component: PryFilterSettingsComponent;
  let fixture: ComponentFixture<PryFilterSettingsComponent>;
  let filterSteps = FilterSteps;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryFilterSettingsComponent,
        MockI18nPipe,
        MockPryIconComponent,
        MockPrySelectGridLayoutCssComponent,
        MockPryToolboxCssComponent
      ],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: ClassSelectors.classes,
              value: [
                ...mapUtilsData.classes,
                {
                  id: '9e397c90-b109-423d-812b-3c4ff815ce71',
                  name: 'class-name',
                  attributes: [
                    { id: 'loc', name: 'loc', technicalName: 'loc', field: 'loc-xxxx' },
                    { id: 'lat', name: 'lat', technicalName: 'lat', field: 'lat-xxxx' },
                    { id: 'lng', name: 'lng', technicalName: 'lng', field: 'lng-xxxx' },
                    { id: 'intensity', name: 'intensity', technicalName: 'intensity', field: 'intensity-xxxx' }
                  ]
                }
              ]
            },
            {
              selector: DataSourceSelectors.getDataSources,
              value: [...namedQueryList].map((ds) => {
                return { ...ds, name: 'ds-name' };
              })
            },
            {
              selector: DashboardSelectors.namedQueriesUses,
              value: {
                fakeid: {
                  windowIndex: 1,
                  rsName: 'rs-name',
                  type: 'map',
                  layout: {
                    x: 1,
                    y: 1,
                    width: 10,
                    height: 10
                  }
                }
              }
            },
            {
              selector: FieldSelectors.fields,
              value: [
                {
                  id: 'intensity-xxxx',
                  name: 'intensity',
                  type: FieldType.KEYWORD
                } as Field
              ]
            },
            {
              selector: DashboardSelectors.presentation,
              value: {
                current: {
                  id: 'e288f538-214d-479a-a2da-949ce02c8905',
                  name: 'fake name',
                  creationDate: '1974-10-01T16:40:51.000Z',
                  modificationDate: '1999-05-14T20:14:45.000Z',
                  image: '/assets/svgs/default.svg',
                  visibility: {
                    type: 'PRIVATE'
                  },
                  default: false,
                  owner: true
                },
                initial: {
                  windows: [
                    {
                      widgets: [
                        {
                          type: 'table',
                          layout: {
                            x: 1,
                            y: 1,
                            height: 6,
                            width: 12
                          },
                          options: {},
                          datasource: '39061554-298f-4f56-8cd2-51ccec998307'
                        }
                      ],
                      route: '/dashboard'
                    }
                  ]
                },
                viewMode: 'catalog'
              }
            }
          ]
        }),
        {
          provide: Overlay,
          useClass: MockOverlay
        },
        {
          provide: FilterFactoryService,
          useValue: {
            types$: of(['text', 'list']),
            generateTooltip: (type: string, parentInjector: Injector, container: ViewContainerRef) => of(null)
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PryFilterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit filter', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.filter = filter;
    component.submitFilter();

    expect(spy.mock.calls).toEqual([[DashboardActions.updateFilters({ filter })]]);
  });

  it('should delete filter', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.filters = [filter];
    component.deleteFilter(filter.id);

    expect(spy.mock.calls).toEqual([[DashboardActions.removeFilter({ id: filter.id })]]);
  });

  describe('attribute$', () => {
    it('should return a list of attributes of the classes of the namedqueries present in the presentation', () => {
      const expected$ = hot('a', {
        a: [
          {
            datasource: 'fakeid',
            id: 'loc',
            label: 'loc / ds-name / class-name',
            technicalName: 'loc',
            type: 'string'
          },
          {
            datasource: 'fakeid',
            id: 'lat',
            label: 'lat / ds-name / class-name',
            technicalName: 'lat',
            type: 'string'
          },
          {
            datasource: 'fakeid',
            id: 'lng',
            label: 'lng / ds-name / class-name',
            technicalName: 'lng',
            type: 'string'
          },
          {
            datasource: 'fakeid',
            id: 'intensity',
            label: 'intensity / ds-name / class-name',
            technicalName: 'intensity',
            type: 'keyword'
          }
        ]
      });
      expect(component.attributes$).toBeObservable(expected$);
    });
  });

  describe('filter available attributes', () => {
    // first arg, second arg, expected result
    const cases: [string, Attribute[], Attribute[]][] = [
      ['text', attributes, [attributes[0], attributes[4]]],
      ['date', [...attributes], [attributes[1]]],
      ['number', attributes, [attributes[2]]],
      ['list', attributes, attributes]
    ];

    test.each(cases)('should return attributes of the filter type (%p)', (firstArg, secondArg, expectedResult) => {
      const result = component.filterAttributes(firstArg, secondArg);
      expect(result).toEqual(expectedResult);
    });

    /* it('should return attributes of the same type as the first selected attribute, if filter type is list/custom', () => {
      component.selectedAttribute$.next([attributes[0].id]);
      expect(component.filterAttributes('list', attributes)).toEqual(
        attributes.filter((attr) => attr.type === attributes[0].type)
      );
    }); */
  });

  it('should select attributes', () => {
    let attribute = {
      id: 'id',
      name: 'test-attr',
      technicalName: 'tech-test-attr',
      label: 'Test Attr',
      datasource: 'ds',
      type: 'string'
    } as Attribute;
    component.selectAttribute([attribute]);
    expect(component.filter.attributes).toEqual([attribute]);
    expect(component.selectedAttribute$.value).toEqual(['id']);
  });

  it('should get operators based on filter type', () => {
    component.currentFilterComponentType$.next('date');
    expect(component.currentOperators$.value.map((operator) => operator.value)).toEqual([
      'EQUALS',
      'NOT_EQUALS',
      'GREATER_THAN',
      'LOWER_THAN'
    ]);

    component.filter.hasDateRange = true;
    component.currentFilterComponentType$.next('date');
    expect(component.currentOperators$.value.map((operator) => operator.value)).toEqual(['INSIDE', 'OUTSIDE']);

    component.currentFilterComponentType$.next('list');
    expect(component.currentOperators$.value.map((operator) => operator.value)).toEqual(['EQUALS']);

    component.currentFilterComponentType$.next('number');
    expect(component.currentOperators$.value.map((operator) => operator.value)).toEqual([
      'EQUALS',
      'NOT_EQUALS',
      'GREATER_THAN',
      'LOWER_THAN'
    ]);

    component.currentFilterComponentType$.next('text');
    expect(component.currentOperators$.value.map((operator) => operator.value)).toEqual([
      'EQUALS',
      'NOT_EQUALS',
      'CONTAINS',
      'START_WITH',
      'END_WITH'
    ]);
  });

  describe('overlay', () => {
    it('should display modal on toggle', () => {
      component.toggleSettings();
      expect(component.settingsOpened).toBeTruthy();
    });

    it('should close modal and set filters on modal close', () => {
      const spy = jest.spyOn(store, 'dispatch');
      component.toggleSettings();
      component.toggleSettings();

      expect(component.settingsOpened).toBeFalsy();
      expect(spy.mock.calls).toEqual([
        [ConfigActions.addingOverlay({ id: 'PryFilterSettingsComponent' })],
        [ConfigActions.closeOverlay({ id: 'PryFilterSettingsComponent' })],
        [DashboardActions.setFilters({ filters: [] })]
      ]);
    });
  });

  describe('navigation', () => {
    it('should go to EDITION of selected filter', () => {
      component.goToEdition(filter);

      expect(component.currentStep).toBe(filterSteps.EDITION);
      expect(component.filter).toEqual(filter);
    });

    it('should go to CREATION', () => {
      component.goToCreation();
      expect(component.filter).toEqual(emptyFilter);
    });

    it('should go back to LIST view and unset filter', () => {
      component.currentStep = filterSteps.EDITION;
      component.filter = filter;

      component.goBack();
      expect(component.currentStep).toBe(filterSteps.LIST);
      expect(component.filter).toEqual(emptyFilter);
    });
  });
});
