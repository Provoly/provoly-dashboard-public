import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigActions, MultiClassCondition } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../mock/components/mock-pry-select.component';
import { MockPryMultiClassFieldSelectionComponent } from '../../../../mock/components/search/mock-pry-multi-class-field-selection.component';
import { MockNgFormDirective } from '../../../../mock/directive/mock-ng-form.directive';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { MockPryTooltipDirective } from '../../../../mock/directive/mock-pry-tooltip.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { MockOverlay } from '../../../../mock/service/mock-overlay.service';
import { SearchMultiClassActions } from '../../store/search-multi-class.actions';
import { SearchMultiClassSelectors } from '../../store/search-multi-class.selectors';
import { MultiClassConditionComponent } from './multi-class-condition.component';

describe('MultiClassConditionComponent', () => {
  let component: MultiClassConditionComponent;
  let fixture: ComponentFixture<MultiClassConditionComponent>;
  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        MultiClassConditionComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPrySelectComponent,
        MockPryMultiClassFieldSelectionComponent,
        MockPryTooltipDirective,
        MockNgFormDirective,
        MockNgModelDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SearchMultiClassSelectors.conditions,
              value: [
                {
                  id: 'id',
                  field: 'field',
                  isDate: false,
                  operator: 'EQUALS',
                  value: 'value',
                  pattern: '.*'
                }
              ]
            }
          ]
        }),
        {
          provide: Overlay,
          useClass: MockOverlay
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiClassConditionComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    component.id = 'id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set the conditon', () => {
    component.id = 'idCondition';
    fixture.detectChanges();
    expect(component.form.enabled).toEqual(true);
  });
  it('should dispatch update condition operator ', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.form.patchValue({ operator: 'operator' });
    expect(spy.mock.calls).toEqual([
      [SearchMultiClassActions.updateCondition({ conditionId: 'id', key: 'operator', value: 'operator' })],
      [SearchMultiClassActions.updateCondition({ conditionId: 'id', key: 'operator', value: 'operator' })]
    ]);
  });
  it('should dispatch remove condition ', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onRemoveCondition({ id: 'id' } as MultiClassCondition);
    expect(spy.mock.calls).toEqual([[SearchMultiClassActions.removeCondition({ conditionId: 'id' })]]);
  });
  it('should dispatch update condition ', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onUpdateValue({ id: 'id', value: 'oldValue' } as MultiClassCondition);
    expect(spy.mock.calls).toEqual([
      [
        SearchMultiClassActions.updateCondition({
          conditionId: 'id',
          key: 'value',
          value: 'value',
          upperValue: undefined
        })
      ]
    ]);
  });
  it('should dispatch change field ', () => {
    component.opened = true;
    const spy = jest.spyOn(store, 'dispatch');
    component.onChangeField({ id: 'id', field: 'oldValue' } as MultiClassCondition, 'newField');
    expect(spy.mock.calls).toEqual([
      [SearchMultiClassActions.updateConditionField({ conditionId: 'id', field: 'newField' })],
      [ConfigActions.closeOverlay({ id: 'MultiClassConditionComponent' })]
    ]);
    expect(component.opened).toEqual(false);
  });
  it('should open and close panel', async () => {
    component.toggleFieldSelection();
    expect(component.opened).toEqual(true);
    component.onCloseModal();
    expect(component.opened).toEqual(false);
  });
});
