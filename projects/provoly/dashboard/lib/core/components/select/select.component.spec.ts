import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { PrySelectComponent } from './select.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { Overlay } from '@angular/cdk/overlay';
import { mockStringList } from '@provoly/dashboard/mock/data/mockLists';
import { mockEvent } from '@provoly/dashboard/mock/data/mockEvent';
import { cold } from 'jest-marbles';
import { MockCdkMonitorElementFocusDirective } from '@provoly/dashboard/mock/directive/mock-cdk-monitor-element-focus.directive';
import { By } from '@angular/platform-browser';
import { SelectA11yService } from './select-a11y.service';
import { A11yModule, InteractivityChecker } from '@angular/cdk/a11y';

describe('SelectComponent', () => {
  let component: PrySelectComponent;
  let fixture: ComponentFixture<PrySelectComponent>;
  let overlay: Overlay;
  let a11y: SelectA11yService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySelectComponent,
        MockNgModelDirective,
        MockI18nPipe,
        MockPryIconComponent,
        MockCdkMonitorElementFocusDirective
      ],
      providers: [
        Overlay,
        SelectA11yService,
        {
          provide: InteractivityChecker,
          useValue: {
            isFocusable: () => true
          }
        }
      ],
      imports: [A11yModule]
    }).compileComponents();
    overlay = TestBed.inject(Overlay);
    a11y = TestBed.inject(SelectA11yService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.items = mockStringList;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle', () => {
    it('should open and close', () => {
      const select = fixture.debugElement.query(By.css('.a-pry-select'));
      const spyOverlay = jest.spyOn(overlay, 'create');

      // open
      select.nativeElement.click();

      expect(component.open).toBeTruthy();
      expect(spyOverlay).toHaveBeenCalled();
      expect(component.overlayRef).toBeDefined();

      // close
      const spyDispose = jest.spyOn(component.overlayRef!, 'dispose');
      component.toggle();
      expect(component.open).toBeFalsy();
      expect(spyDispose).toHaveBeenCalled();
    });
  });

  describe('_items$', () => {
    it('should track the list of elements to show in dropdown', () => {
      expect(component._items$.value).not.toBeFalsy();
      expect(component._items$.value.length).toEqual(3);
    });
  });

  // value$ emits either a single element or an array of elements
  // it is used to track the selected element/elements
  describe('value$', () => {
    describe('tracks component value', () => {
      let el1: string;

      beforeEach(() => {
        el1 = mockStringList[0];
      });

      it('when multiple is false the value is never an array', () => {
        component.select({} as Event, el1, 0);
        expect(component.value$.value).toEqual(el1);
      });

      describe('when multiple is true', () => {
        beforeEach(() => {
          component.multiple = true;
        });

        it('the emitted value is an array of selected elements', () => {
          const el2 = mockStringList[1];
          component.select(mockEvent, el1, 0);
          component.select(mockEvent, el2, 1);
          expect(component.value$.value).toEqual([el1, el2]);
        });

        it('the emitted value is empty if an element was selected then deselected', () => {
          component.select(mockEvent, el1, 0);
          component.select(mockEvent, el1, 0);
          expect(component.value$.value).toEqual([]);
        });
      });
    });
  });

  // valueItems$ always outputs an array of type any[]
  // it is only used in the html template
  describe('valuesItems$', () => {
    it('if multiple is false, should always output array with exactly one selected element', () => {
      component.value$.next(mockStringList[0]);

      expect(component.valueItems$).toBeObservable(
        cold('a', {
          a: [mockStringList[0]]
        })
      );
    });

    it('if multiple is true, should output array with all selected elements', () => {
      const selectedItems = [mockStringList[0], mockStringList[2]];
      component.multiple = true;
      component.value$.next(selectedItems);

      expect(component.valueItems$).toBeObservable(
        cold('a', {
          a: selectedItems
        })
      );
    });
  });

  describe('matchingItems$', () => {
    beforeEach(() => {
      component.autocomplete = true;
    });

    it('should emit filtered items based on search value', () => {
      component.search$.next(mockStringList[1]);

      expect(component.matchingItems$).toBeObservable(
        cold('a', {
          a: [mockStringList[1]]
        })
      );
    });

    it('should emit empty array if no values match', () => {
      component.search$.next('not a match');

      expect(component.matchingItems$).toBeObservable(
        cold('a', {
          a: []
        })
      );
    });

    it('should not filter if no search value', () => {
      component.search$.next('');

      expect(component.matchingItems$).toBeObservable(
        cold('a', {
          a: mockStringList
        })
      );
    });

    it('should not filter if externalAutocompleteService is true', () => {
      component.externalAutocompleteService = true;
      component.search$.next('string 1');

      expect(component.matchingItems$).toBeObservable(
        cold('a', {
          a: mockStringList
        })
      );
    });
  });

  describe('clear()', () => {
    it('should remove element passed in parameter from current value$', () => {
      component.value$.next(mockStringList);

      component.clear(mockEvent, mockStringList[0]);

      expect(component.value$.value).toEqual([mockStringList[1], mockStringList[2]]);
    });
  });

  describe('clearAll()', () => {
    it('if multiple is true, should set value$ to empty array', () => {
      const spy = jest.spyOn(component.cleared, 'next');
      component.multiple = true;
      component.value$.next(mockStringList);

      component.clearAll(mockEvent);

      expect(component.value$.value).toEqual([]);
      expect(spy).toHaveBeenCalled();
    });

    it('if multiple is false, should set value$ to undefined', () => {
      const spy = jest.spyOn(component.cleared, 'next');
      component.value$.next(mockStringList);

      component.clearAll(mockEvent);

      expect(component.value$.value).toBeUndefined();
      expect(spy).toHaveBeenCalled();
    });
  });
});
