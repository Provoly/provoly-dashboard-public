import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Class, ClassSelectors } from '@provoly/dashboard';
import { MockPrySearchOrderComponent } from '@provoly/dashboard/mock/components/mock-pry-search-order.component';
import { MockPrySelectComponent } from '../../../../mock/components/mock-pry-select.component';
import { MockPryMonoSearchComposedComponent } from '../../../../mock/components/search/mock-pry-mono-search-composed.component';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { SearchMonoClassActions } from '../../store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';
import { PrySearchMonoClassComponent } from './search-mono-class.component';

describe('PrySearchMonoClassComponent', () => {
  let component: PrySearchMonoClassComponent;
  let store: Store;
  let fixture: ComponentFixture<PrySearchMonoClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySearchMonoClassComponent,
        MockTranslatePipe,
        MockPrySelectComponent,
        MockPryMonoSearchComposedComponent,
        MockNgModelDirective,
        MockI18nPipe,
        MockPrySearchOrderComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SearchMonoClassSelectors.selectMonoClassConditionsMasterId,
              value: 'id'
            },
            {
              selector: SearchMonoClassSelectors.selectMonoClassIdSearch,
              value: 'id'
            },
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'id',
                  name: 'class'
                } as Class
              ]
            },
            {
              selector: ClassSelectors.classById('id'),
              value: {
                id: 'id',
                name: 'class'
              } as Class
            }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchMonoClassComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the class', fakeAsync(() => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onChangeClass('id2');
    tick();
    expect(spy.mock.calls).toEqual([
      [SearchMonoClassActions.addOrder({})],
      [SearchMonoClassActions.selectMonoClassSearch({ classId: 'id2' })]
    ]);
  }));
});
