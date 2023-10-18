import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Class, DashboardActions, DEFAULT_NAMED_QUERY_ID, FullTextSearchPayload, NamedQuery } from '@provoly/dashboard';
import { MockPrySearchCssComponent } from '@provoly/dashboard/mock/style/mock-pry-search-css';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPryChooseWidgetComponent } from '../../../mock/components/search/mock-pry-chose-widget.component';
import { MockCdkConnectedOverlayDirective } from '../../../mock/directive/mock-cdk-connected-overlay.directive';
import { MockCdkOverlayOriginDirective } from '../../../mock/directive/mock-cdk-overlay-origin.directive';
import { MockNgModelDirective } from '../../../mock/directive/mock-ng-model.directive';
import { MockPryOverlayDirective } from '../../../mock/directive/mock-pry-overlay.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { searchFulltextActions } from '../store/search-fulltext.actions';
import { PrySearchFulltextComponent } from './search-fulltext.component';

describe('PrySearchFulltextComponent', () => {
  let component: PrySearchFulltextComponent;
  let fixture: ComponentFixture<PrySearchFulltextComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySearchFulltextComponent,
        MockCdkConnectedOverlayDirective,
        MockCdkOverlayOriginDirective,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPryOverlayDirective,
        MockNgModelDirective,
        MockPryChooseWidgetComponent,
        MockI18nPipe,
        MockPrySearchCssComponent
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchFulltextComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should update search and classes with input', () => {
    component.currentEdit = null;
    fixture.detectChanges();
    expect(component.search).toEqual('');
    expect(component.classesSelected).toEqual([]);
    component.currentEdit = {
      request: {
        fullSearch: { value: 'value' },
        oClasses: ['classes']
      } as FullTextSearchPayload
    } as NamedQuery;
    fixture.detectChanges();
    expect(component.search).toEqual('value');
    expect(component.classesSelected).toEqual(['classes']);
  });
  it('should launch search', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.search = 'search';
    component.classesSelected = ['class'];
    component.onSearch();
    expect(spy.mock.calls).toEqual([
      [searchFulltextActions.search({ classes: ['class'], search: 'search' })],
      [
        DashboardActions.updateWidgetInPresentation({
          id: DEFAULT_NAMED_QUERY_ID,
          widgetType: 'table'
        })
      ]
    ]);
  });

  it('should change search', () => {
    component.onChangeSearch({ target: { value: 'value' } });
    expect(component.searchDisabled).toEqual(false);
    component.onChangeSearch({ target: { value: '' } });
    expect(component.searchDisabled).toEqual(true);
  });
  it('should clear search', () => {
    component.search = 'search';
    component.onClearSearch({ target: { value: '' } });
    expect(component.search).toEqual('');
    expect(component.searchDisabled).toEqual(true);
  });
  it('should open panel', () => {
    component.search = 'search';
    component.onOpenSearchPanel();
    expect(component.isFocused).toEqual(true);
    expect(component.panelSearchOpen).toEqual(true);
    component.onFocusOut();
    expect(component.isFocused).toEqual(false);
  });
  it('should select widget', () => {
    component.onSelectWidget('widget');
    expect(component.widgetSelected).toEqual('widget');
  });
  it('should select all classes', () => {
    component.onSelectAllClasses();
    expect(component.classesSelected).toEqual([]);
  });
  it('should select class and remove', () => {
    component.onSelectClass({ id: 'id' } as Class);
    component.onSelectClass({ id: 'id2' } as Class);
    expect(component.classesSelected).toEqual(['id', 'id2']);
    component.onSelectClass({ id: 'id' } as Class);
    expect(component.classesSelected).toEqual(['id2']);
  });
});
