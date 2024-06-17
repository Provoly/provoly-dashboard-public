import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ClassSelectors,
  DashboardSelectors,
  DEFAULT_TABLE_WIDGET_STYLE,
  FieldSelectors,
  TableWidgetOptions
} from '@provoly/dashboard';
import { MockPryWidgetTableCssComponent } from '@provoly/dashboard/mock/style/mock-pry-widget-table-css';
import { hot } from 'jest-marbles';
import { of } from 'rxjs';
import { MockPryExpandValueComponent } from '../../../mock/components/dashboard/mock-pry-expand-value.component';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockPrySettingsComponent } from '../../../mock/components/mock-pry-settings.component';
import { MockPryWidgetHeaderComponent } from '../../../mock/components/mock-pry-widget-header.component';
import { MockNgModelDirective } from '../../../mock/directive/mock-ng-model.directive';
import { MockGetValuePipe } from '../../../mock/pipe/mock-get-value.pipe';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslateIdPipe } from '../../../mock/pipe/mock-translate-id.pipe';

import { WidgetTableComponent } from './widget-table.component';

describe('WidgetTableComponent', () => {
  let component: WidgetTableComponent;
  let fixture: ComponentFixture<WidgetTableComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetTableComponent,
        MockPrySettingsComponent,
        MockPryIconComponent,
        MockPrySelectComponent,
        MockTranslateIdPipe,
        MockPryCheckboxComponent,
        MockGetValuePipe,
        MockPryWidgetHeaderComponent,
        MockNgModelDirective,
        MockPryExpandValueComponent,
        MockI18nPipe,
        MockPryWidgetTableCssComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.resultSets,
              value: {
                a: {
                  items: {
                    a: [{ id: '5', oClass: 'a', attributes: { test: { value: 4, type: 'VALUE', visible: true } } }],
                    b: [{ id: '5', oClass: 'b', attributes: { test2: { value: 4, type: 'VALUE', visible: true } } }],
                    c: [{ id: '5', oClass: 'c', attributes: { test2: { value: 4, type: 'VALUE', visible: true } } }]
                  },
                  relations: []
                }
              }
            },
            {
              selector: FieldSelectors.fields,
              value: [
                { id: 'f1', name: 'test', type: 'string' },
                { id: 'f2', name: 'test2', type: 'string' },
                { id: 'f3', name: 'test3', type: 'integer' },
                { id: 'f4', name: 'test4', type: 'instant' }
              ]
            },
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'a',
                  attributes: [{ id: '1', field: 'f1', name: 'field-name-1', technicalName: 'field-name-1' }]
                },
                {
                  id: 'b',
                  attributes: [{ id: '2', field: 'f2', name: 'field-name-2', technicalName: 'field-name-2' }]
                },
                {
                  id: 'c',
                  attributes: [{ id: '3', field: 'f2', name: 'field-name-3', technicalName: 'field-name-3' }]
                },
                { id: 'd', attributes: [{ id: '4', field: 'f2', name: 'field-name-4', technicalName: 'field-name-4' }] }
              ]
            }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow emitting manifest', () => {
    const spy = jest.spyOn(component.manifestModified, 'emit').mockReturnValue();
    DashboardSelectors.widgetManifest(0).setResult({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: { columns: [] },
      type: 'placeholder'
    });
    component._manifest$ = of({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: { columns: [] },
      type: 'placeholder'
    });
    component.widgetIndex = 0;
    component.emitManifest();
    expect(spy).toHaveBeenCalledWith({
      widgetIndex: 0,
      manifest: {
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: { columns: [], style: DEFAULT_TABLE_WIDGET_STYLE.value },
        type: 'placeholder'
      }
    });
  });

  it('should allow adding column', () => {
    component.optionsCopy = {};
    component.addColumn();
    expect(component.optionsCopy).toEqual({ columns: [{ label: '', property: '' }] });
  });

  it('should allow property name change', () => {
    component.optionsCopy = { columns: [{ label: 'aaa', property: 'bbb' }] } as TableWidgetOptions;
    component.changePropertyName('ccc', (component.optionsCopy.columns ?? [])[0]);
    expect(component.optionsCopy).toEqual({ columns: [{ label: 'aaa', property: 'ccc' }] });
  });

  it('should allow label change', () => {
    component.optionsCopy = { columns: [{ label: 'aaa', property: 'bbb' }] } as TableWidgetOptions;
    component.changeLabel(
      { currentTarget: { value: 'ccc' } } as unknown as Event,
      (component.optionsCopy.columns ?? [])[0]
    );
    expect(component.optionsCopy).toEqual({ columns: [{ label: 'ccc', property: 'bbb' }] });
  });

  it('should allow deleting column', () => {
    component.optionsCopy = {
      columns: [
        { label: 'a', property: '' },
        { label: 'b', property: '' },
        { label: 'c', property: '' }
      ]
    };
    component.deleteColumn(1);
    expect(component.optionsCopy).toEqual({
      columns: [
        { label: 'a', property: '' },
        { label: 'c', property: '' }
      ]
    });
  });

  it('should auto calculate columns', () => {
    component.widgetIndex = 0;
    DashboardSelectors.widgetManifest(0).setResult({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: {},
      type: 'table',
      datasource: 'a'
    });
    component._manifest$ = of({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: {},
      type: 'table',
      datasource: 'a'
    });
    fixture.detectChanges();
    expect(component.columns$).toBeObservable(
      hot('a', {
        a: [
          { attributeId: '1', label: 'field-name-1', property: 'field-name-1' },
          { attributeId: '2', label: 'field-name-2', property: 'field-name-2' },
          { attributeId: '3', label: 'field-name-3', property: 'field-name-3' }
        ]
      })
    );
  });
});
