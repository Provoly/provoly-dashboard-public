import { PryGroupShareComponent, PryShareMode } from './group-share.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryChipsSelectorComponent } from '@provoly/dashboard/mock/components/mock-pry-chips-selector.component';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { mockGroups } from '@provoly/dashboard/mock/data/mockGroups';

const groupNames = mockGroups.map((group) => group.name);

describe('PryGroupShareComponent', () => {
  let component: PryGroupShareComponent;
  let fixture: ComponentFixture<PryGroupShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [PryGroupShareComponent, MockI18nPipe, MockPryChipsSelectorComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.accessGroups,
              value: mockGroups
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryGroupShareComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('writeValue', () => {
    it('should emit input group names and update radio value', () => {
      component.writeValue(groupNames);
      fixture.detectChanges();

      expect(component.assignedGroupNames$.getValue()).toEqual(groupNames);
      expect(component.radioValue).toEqual(PryShareMode.GROUPS);
    });
  });

  describe('groups$', () => {
    it('should return all groups except ALL', () => {
      fixture.detectChanges();
      const expected$ = hot('a', {
        a: mockGroups.filter((group) => group.name !== 'ALL')
      });
      expect(component.groups$).toBeObservable(expected$);
    });
  });

  describe('radioValue', () => {
    describe('on initalization', () => {
      it('should have radioValue set to PRIVATE by default', () => {
        fixture.detectChanges();
        expect(component.radioValue).toEqual(PryShareMode.PRIVATE);
      });

      it('should have radioValue set to PUBLIC if input value is ["ALL"]', () => {
        component.writeValue(['ALL']);
        fixture.detectChanges();

        expect(component.radioValue).toEqual(PryShareMode.PUBLIC);
      });

      it('should have the radioValue set to RESTRICTED in any other case', () => {
        component.writeValue(['my-group']);
        fixture.detectChanges();

        expect(component.radioValue).toEqual(PryShareMode.GROUPS);
      });
    });

    describe('on change', () => {
      it('should output an empty array if radioValue set to PRIVATE', () => {
        const spy = jest.spyOn(component, 'changeGroups');
        fixture.detectChanges();

        component.onRadioValueChange(PryShareMode.PUBLIC);
        component.onRadioValueChange(PryShareMode.PRIVATE);

        expect(spy).toHaveBeenCalledWith([], 'radioChange');
      });

      it('should output an array with a string "ALL" if radioValue set to PUBLIC', () => {
        const spy = jest.spyOn(component, 'changeGroups');
        fixture.detectChanges();

        component.onRadioValueChange(PryShareMode.PUBLIC);

        expect(spy).toHaveBeenCalledWith(['ALL'], 'radioChange');
      });

      it('should reput the original groups present on the dashboard everytime when removing and reputting RESTRICTED mode', () => {
        const spy = jest.spyOn(component, 'changeGroups');
        fixture.detectChanges();

        expect(component.assignedGroups$).toBeObservable(hot('a', { a: [] }));

        component.onRadioValueChange(PryShareMode.GROUPS);
        expect(spy).toHaveBeenCalledWith([], 'radioChange');

        component.onRadioValueChange(PryShareMode.PUBLIC);
        component.onRadioValueChange(PryShareMode.GROUPS);
        expect(spy).toHaveBeenCalledWith([], 'radioChange');

        expect(component.assignedGroupNames$.getValue()).toEqual([]);
        expect(component.assignedGroups$).toBeObservable(hot('a', { a: [] }));
      });
    });
  });
});
