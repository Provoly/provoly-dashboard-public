import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  CategorySelectors,
  ClassSelectors,
  DashboardSelectors,
  DetailWidgetOptions,
  PryI18nService
} from '@provoly/dashboard';
import { MockPryWidgetDetailCssComponent } from '@provoly/dashboard/mock/style/mock-pry-widget-detail-css';
import { hot } from 'jest-marbles';
import { of } from 'rxjs';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPryWidgetHeaderComponent } from '../../../mock/components/mock-pry-widget-header.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslateIdPipe } from '../../../mock/pipe/mock-translate-id.pipe';
import { MockTranslateItemToSymbolPipe } from '../../../mock/pipe/mock-translate-item-to-symbol.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { WidgetDetailComponent } from './widget-detail.component';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

describe('WidgetDetailComponent', () => {
  let component: WidgetDetailComponent;
  let fixture: ComponentFixture<WidgetDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        WidgetDetailComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockTranslateIdPipe,
        MockTranslateItemToSymbolPipe,
        MockPryWidgetHeaderComponent,
        MockI18nPipe,
        MockPryWidgetDetailCssComponent
      ],
      providers: [
        { provide: PryI18nService, useClass: MockPryI18nService },
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.allItems,
              value: [
                {
                  id: '1',
                  oClass: 'aaa',
                  attributes: {
                    test1: { value: 4, type: 'VALUE', visible: true },
                    test2: { value: 5, type: 'VALUE', visible: true },
                    test3: { value: 6, type: 'VALUE', visible: true }
                  }
                },
                {
                  id: '2',
                  oClass: 'bbb',
                  attributes: {
                    test1: { value: 7, type: 'VALUE', visible: true },
                    test2: { value: 8, type: 'VALUE', visible: true },
                    test3: { value: 9, type: 'VALUE', visible: true }
                  }
                },
                {
                  id: '3',
                  oClass: 'ccc',
                  attributes: {
                    test4: { value: 10, type: 'VALUE', visible: true },
                    test5: { value: 11, type: 'VALUE', visible: true },
                    test6: { value: 12, type: 'VALUE', visible: true }
                  }
                },
                {
                  id: '4',
                  oClass: 'ddd',
                  attributes: {
                    test7: { value: 13, type: 'VALUE', visible: true },
                    test8: { value: 14, type: 'VALUE', visible: true },
                    test9: { value: 15, type: 'VALUE', visible: true }
                  }
                },
                {
                  id: '5',
                  oClass: 'eee',
                  attributes: {
                    test10: { value: 16, type: 'VALUE', visible: true },
                    test20: { value: 17, type: 'VALUE', visible: true },
                    test30: { value: 18, type: 'VALUE', visible: true }
                  }
                }
              ]
            },
            {
              selector: CategorySelectors.categories,
              value: [
                { id: 'cat1', name: 'cat1-name' },
                { id: 'cat2', name: 'cat2-name' },
                { id: 'cat3', name: 'cat3-name' },
                { id: 'cat4', name: 'cat4-name' },
                { id: 'cat5', name: 'cat5-name' },
                { id: 'cat6', name: 'cat6-name' },
                { id: 'cat7', name: 'cat7-name' }
              ]
            },
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'aaa',
                  name: 'a',
                  attributes: [
                    { id: 1, name: 'test1', category: 'cat1' },
                    { id: 2, name: 'test2', category: 'cat2' },
                    { id: 3, name: 'test3', category: 'cat1' }
                  ]
                },
                {
                  id: 'bbb',
                  name: 'b',
                  attributes: [
                    { id: 1, name: 'test1', category: 'cat3' },
                    { id: 2, name: 'test2', category: 'cat3' },
                    { id: 3, name: 'test3', category: 'cat4' }
                  ]
                },
                {
                  id: 'ccc',
                  name: 'c',
                  attributes: [
                    { id: 1, name: 'test4', category: 'cat5' },
                    { id: 2, name: 'test5', category: 'cat5' },
                    { id: 3, name: 'test6', category: 'cat6' }
                  ]
                },
                {
                  id: 'ddd',
                  name: 'd',
                  attributes: [
                    { id: 1, name: 'test7', category: 'cat6' },
                    { id: 2, name: 'test8', category: 'cat7' },
                    { id: 3, name: 'test9', category: 'cat7' }
                  ]
                },
                {
                  id: 'eee',
                  name: 'e',
                  attributes: [
                    { id: 1, name: 'test10', category: 'cat1' },
                    { id: 2, name: 'test20', category: 'cat2' },
                    { id: 3, name: 'test30', category: 'cat1' }
                  ]
                }
              ]
            },
            { selector: DashboardSelectors.objectDetails, value: {} }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('itemsToDisplay$', () => {
    it('should want to display correct list of items', () => {
      DashboardSelectors.selectedItems.setResult([
        {
          id: '1',
          oClass: 'aaa',
          attributes: {
            test1: { value: 4, type: 'VALUE', visible: true },
            test2: { value: 5, type: 'VALUE', visible: true },
            test3: { value: 6, type: 'VALUE', visible: true }
          }
        },
        {
          id: '2',
          oClass: 'bbb',
          attributes: {
            test1: { value: 7, type: 'VALUE', visible: true },
            test2: { value: 8, type: 'VALUE', visible: true },
            test3: { value: 9, type: 'VALUE', visible: true }
          }
        },
        {
          id: '3',
          oClass: 'ccc',
          attributes: {
            test4: { value: 10, type: 'VALUE', visible: true },
            test5: { value: 11, type: 'VALUE', visible: true },
            test6: { value: 12, type: 'VALUE', visible: true }
          }
        }
      ]);
      component._manifest$ = of({
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: {},
        type: 'table',
        datasource: 'a'
      });
      component.widgetIndex = 0;
      const expected$ = hot('a', {
        a: [
          {
            id: '1',
            oClass: 'aaa',
            attributes: {
              test1: { value: 4, type: 'VALUE', visible: true },
              test2: { value: 5, type: 'VALUE', visible: true },
              test3: { value: 6, type: 'VALUE', visible: true }
            }
          },
          {
            id: '2',
            oClass: 'bbb',
            attributes: {
              test1: { value: 7, type: 'VALUE', visible: true },
              test2: { value: 8, type: 'VALUE', visible: true },
              test3: { value: 9, type: 'VALUE', visible: true }
            }
          },
          {
            id: '3',
            oClass: 'ccc',
            attributes: {
              test4: { value: 10, type: 'VALUE', visible: true },
              test5: { value: 11, type: 'VALUE', visible: true },
              test6: { value: 12, type: 'VALUE', visible: true }
            }
          }
        ]
      });
      expect(component.itemsToDisplay$).toBeObservable(expected$);
    });

    it('should want to display correct list of items if specified in options', () => {
      DashboardSelectors.selectedItems.setResult([
        {
          id: '1',
          oClass: 'aaa',
          attributes: {
            test1: { value: 4, type: 'VALUE', visible: true },
            test2: { value: 5, type: 'VALUE', visible: true },
            test3: { value: 6, type: 'VALUE', visible: true }
          }
        },
        {
          id: '5',
          oClass: 'eee',
          attributes: {
            test10: { value: 16, type: 'VALUE', visible: true },
            test20: { value: 17, type: 'VALUE', visible: true },
            test30: { value: 18, type: 'VALUE', visible: true }
          }
        }
      ]);
      component._manifest$ = of({
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: { itemIds: ['1', '5'] } as DetailWidgetOptions,
        type: 'table',
        datasource: 'a'
      });
      component.widgetIndex = 0;
      fixture.detectChanges();
      const expected$ = hot('a', {
        a: [
          {
            attributes: {
              test1: { type: 'VALUE', value: 4, visible: true },
              test2: { type: 'VALUE', value: 5, visible: true },
              test3: { type: 'VALUE', value: 6, visible: true }
            },
            id: '1',
            oClass: 'aaa'
          },
          {
            attributes: {
              test10: { type: 'VALUE', value: 16, visible: true },
              test20: { type: 'VALUE', value: 17, visible: true },
              test30: { type: 'VALUE', value: 18, visible: true }
            },
            id: '5',
            oClass: 'eee'
          }
        ]
      });
      expect(component.itemsToDisplay$).toBeObservable(expected$);
    });

    it('should display specific object if is in objectDetails', () => {
      DashboardSelectors.selectedItems.setResult([]);
      component._manifest$ = of({
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: { itemIds: ['20', '5'] } as DetailWidgetOptions,
        type: 'table',
        datasource: 'a'
      });
      DashboardSelectors.objectDetails.setResult({
        '20': {
          attributes: {
            test1: { type: 'VALUE', value: 4, visible: true },
            test2: { type: 'VALUE', value: 5, visible: true },
            test3: { type: 'VALUE', value: 6, visible: true }
          },
          id: '20',
          oClass: 'XXX'
        }
      });
      component.widgetIndex = 0;
      fixture.detectChanges();
      const expected$ = hot('a', {
        a: [
          {
            attributes: {
              test1: { type: 'VALUE', value: 4, visible: true },
              test2: { type: 'VALUE', value: 5, visible: true },
              test3: { type: 'VALUE', value: 6, visible: true }
            },
            id: '20',
            oClass: 'XXX'
          },
          {
            attributes: {
              test10: { type: 'VALUE', value: 16, visible: true },
              test20: { type: 'VALUE', value: 17, visible: true },
              test30: { type: 'VALUE', value: 18, visible: true }
            },
            id: '5',
            oClass: 'eee'
          }
        ]
      });
      expect(component.itemsToDisplay$).toBeObservable(expected$);
    });

    it('should display priority objects from the resultsetlist', () => {
      DashboardSelectors.selectedItems.setResult([]);
      component._manifest$ = of({
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: { itemIds: ['1'] } as DetailWidgetOptions,
        type: 'table',
        datasource: 'a'
      });
      DashboardSelectors.objectDetails.setResult({
        '1': {
          attributes: {
            test1: { type: 'VALUE', value: 4, visible: true },
            test2: { type: 'VALUE', value: 5, visible: true },
            test3: { type: 'VALUE', value: 6, visible: true }
          },
          id: '1',
          oClass: 'XXX'
        }
      });
      component.widgetIndex = 0;
      fixture.detectChanges();
      const expected$ = hot('a', {
        a: [
          {
            attributes: {
              test1: { type: 'VALUE', value: 4, visible: true },
              test2: { type: 'VALUE', value: 5, visible: true },
              test3: { type: 'VALUE', value: 6, visible: true }
            },
            id: '1',
            oClass: 'aaa'
          }
        ]
      });
      expect(component.itemsToDisplay$).toBeObservable(expected$);
    });
  });
  describe('itemAndCategories$', () => {
    it('should regroup by categories', () => {
      DashboardSelectors.selectedItems.setResult([
        {
          id: '1',
          oClass: 'aaa',
          attributes: {
            test1: { value: 4, type: 'VALUE', visible: true },
            test2: { value: 5, type: 'VALUE', visible: true },
            test3: { value: 6, type: 'VALUE', visible: true }
          }
        },
        {
          id: '5',
          oClass: 'eee',
          attributes: {
            test10: { value: 16, type: 'VALUE', visible: true },
            test20: { value: 17, type: 'VALUE', visible: true },
            test30: { value: 18, type: 'VALUE', visible: true }
          }
        }
      ]);
      DashboardSelectors.widgetManifest(0).setResult({
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: { itemIds: ['1', '5'] } as DetailWidgetOptions,
        type: 'table',
        datasource: 'a'
      });
      component._manifest$ = of({
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: { itemIds: ['1', '5'] } as DetailWidgetOptions,
        type: 'table',
        datasource: 'a'
      });
      component.widgetIndex = 0;
      const expected$ = hot('a', {
        a: [
          {
            categories: [
              {
                id: 'cat1',
                name: 'cat1-name',
                properties: [
                  {
                    attribute: { category: 'cat1', id: 1, name: 'test1' },
                    name: 'test1'
                  },
                  { attribute: { category: 'cat1', id: 3, name: 'test3' }, name: 'test3' }
                ]
              },
              {
                id: 'cat2',
                name: 'cat2-name',
                properties: [{ attribute: { category: 'cat2', id: 2, name: 'test2' }, name: 'test2' }]
              }
            ],
            item: {
              attributes: {
                test1: { type: 'VALUE', value: 4, visible: true },
                test2: { type: 'VALUE', value: 5, visible: true },
                test3: { type: 'VALUE', value: 6, visible: true }
              },
              id: '1',
              oClass: 'aaa'
            }
          },
          {
            categories: [
              {
                id: 'cat1',
                name: 'cat1-name',
                properties: [
                  {
                    attribute: { category: 'cat1', id: 1, name: 'test10' },
                    name: 'test10'
                  },
                  { attribute: { category: 'cat1', id: 3, name: 'test30' }, name: 'test30' }
                ]
              },
              {
                id: 'cat2',
                name: 'cat2-name',
                properties: [{ attribute: { category: 'cat2', id: 2, name: 'test20' }, name: 'test20' }]
              }
            ],
            item: {
              attributes: {
                test10: { type: 'VALUE', value: 16, visible: true },
                test20: { type: 'VALUE', value: 17, visible: true },
                test30: { type: 'VALUE', value: 18, visible: true }
              },
              id: '5',
              oClass: 'eee'
            }
          }
        ]
      });
      expect(component.itemAndCategories$).toBeObservable(expected$);
    });
  });
});
