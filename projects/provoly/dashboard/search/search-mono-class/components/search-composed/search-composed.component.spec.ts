import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Attribute, MonoClassConditions } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockPrySearchConditionComponent } from '../../../../mock/components/mock-pry-search-condition.component';
import { MockPrySelectAttributeComponent } from '../../../../mock/components/mock-pry-search-select-attribute.component';
import { MockPryToggleComponent } from '../../../../mock/components/mock-pry-toggle.component';
import { MockPryOverlayDirective } from '../../../../mock/directive/mock-pry-overlay.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { SearchMonoClassActions } from '../../store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';
import { PrySearchComposedComponent } from './search-composed.component';

const monoClassCondition: MonoClassConditions = {
  masterId: 'masterId',
  entities: {
    masterId: {
      id: 'masterId',
      parentId: 'toto',
      type: 'OR',
      composed: ['subId1', 'subId2']
    },
    subId1: {
      id: 'subId1',
      parentId: 'masterId',
      type: 'ATTRIBUTE'
    },
    subId2: {
      id: 'subId2',
      parentId: 'masterId',
      type: 'ATTRIBUTE'
    }
  },
  ids: ['masterId', 'subId1', 'subId2']
};

describe('PrySearchComposedComponent for master composed condition', () => {
  let component: PrySearchComposedComponent;
  let fixture: ComponentFixture<PrySearchComposedComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        PrySearchComposedComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPrySearchConditionComponent,
        MockPrySelectAttributeComponent,
        MockPryToggleComponent,
        MockPryOverlayDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SearchMonoClassSelectors.selectMonoClassConditions,
              value: monoClassCondition
            }
          ]
        })
      ]
    })
      .overrideComponent(PrySearchComposedComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchComposedComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should add hover state', fakeAsync(() => {
    const element = fixture.debugElement;
    let event = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.nativeElement.dispatchEvent(event);
    tick();
    fixture.detectChanges();
    expect(component.hover).toEqual(true);
  }));
  it('should revmove hover state', fakeAsync(() => {
    const element = fixture.debugElement;
    let event = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.nativeElement.dispatchEvent(event);
    tick();
    fixture.detectChanges();
    event = new MouseEvent('mouseout', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.nativeElement.dispatchEvent(event);
    tick();
    fixture.detectChanges();
    expect(component.hover).toEqual(false);
  }));

  it('should generate composed condition component and select AND type', async () => {
    const spy = jest.spyOn(component, 'onSelectType');
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    const toggle = fixture.debugElement.query(By.directive(MockPryToggleComponent));
    const toggleComponent = toggle.context;
    toggleComponent.writeValue(true);
    expect(spy.mock.calls).toEqual([['masterId', 'AND']]);
  });
  it('should generate master composed condition component and cannot delete', async () => {
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    const item = fixture.debugElement.query(By.css('.pry-search-composed-header-delete-nested-condition'));
    expect(item).toBeNull();
  });
  it('should add nested condition', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onAddNestedCondition('id');
    expect(spy.mock.calls).toEqual([
      [SearchMonoClassActions.addNormalizedConditionComposedForConditionId({ conditionId: 'id' })]
    ]);
  });
  it('should add attribute condition', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onAddAttributeCondition({ id: 'attr' } as Attribute, 'id');
    expect(spy.mock.calls).toEqual([
      [
        SearchMonoClassActions.addNormalizedConditionAttributeForConditionId({
          conditionId: 'id',
          attribute: { id: 'attr' } as Attribute
        })
      ]
    ]);
  });
  it('should delete nested condition', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.onDeleteNestedCondition('id');
    expect(spy.mock.calls).toEqual([[SearchMonoClassActions.deleteNormalizedConditionById({ conditionId: 'id' })]]);
  });
  it('should open and close panel', () => {
    component.onOpenPanel();
    expect(component.panelNewAttributeOpen).toEqual(true);
    component.onClosePanel();
    expect(component.panelNewAttributeOpen).toEqual(false);
  });
});
