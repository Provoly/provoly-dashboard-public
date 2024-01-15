import { PryGroupShareComponent } from './group-share.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { PryVisibilityType } from '../../share/share.model';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryChipsSelectorComponent } from '@provoly/dashboard/mock/components/mock-pry-chips-selector.component';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';

const groups = [
  {
    id: '1',
    system: true,
    name: 'ALL'
  },
  {
    id: '4',
    system: false,
    name: 'CUSTOM-GROUP'
  },
  {
    id: '11',
    system: true,
    name: 'CUSTOM-GROUP-2'
  }
];

const groupNames = groups.map((group) => group.name);

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
              value: groups
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
      expect(component.radioValue).toEqual(PryVisibilityType.RESTRICTED);
    });
  });

  describe('groups$', () => {
    it('should return all groups except ALL', () => {
      fixture.detectChanges();
      const expected$ = hot('a', {
        a: groups.filter((group) => group.name !== 'ALL')
      });
      expect(component.groups$).toBeObservable(expected$);
    });
  });

  describe('radioValue', () => {
    describe('on initalization', () => {
      it('should have radioValue set to PRIVATE by default', () => {
        fixture.detectChanges();
        expect(component.radioValue).toEqual(PryVisibilityType.PRIVATE);
      });

      it('should have radioValue set to PUBLIC if input value is ["ALL"]', () => {
        component.writeValue(['ALL']);
        fixture.detectChanges();

        expect(component.radioValue).toEqual(PryVisibilityType.PUBLIC);
      });

      it('should have the radioValue set to RESTRICTED in any other case', () => {
        component.writeValue(['my-group']);
        fixture.detectChanges();

        expect(component.radioValue).toEqual(PryVisibilityType.RESTRICTED);
      });
    });

    describe('on change', () => {
      it('should output an empty array if radioValue set to PRIVATE', () => {
        const spy = jest.spyOn(component, 'changeGroups');
        fixture.detectChanges();

        component.changeGroupsBasedOnRadioValue(PryVisibilityType.PUBLIC);
        component.changeGroupsBasedOnRadioValue(PryVisibilityType.PRIVATE);

        expect(spy).toHaveBeenCalledWith([]);
      });

      it('should output an array with a string "ALL" if radioValue set to PUBLIC', () => {
        const spy = jest.spyOn(component, 'changeGroups');
        fixture.detectChanges();

        component.changeGroupsBasedOnRadioValue(PryVisibilityType.PUBLIC);

        expect(spy).toHaveBeenCalledWith(['ALL']);
      });

      it('should reput the original groups present on the dashboard everytime when removing and reputting RESTRICTED mode', () => {
        const spy = jest.spyOn(component, 'changeGroups');
        fixture.detectChanges();

        // this observable serves to track the input value of the component, not to track the groups assigned within the component
        expect(component.assignedGroups$).toBeObservable(hot('a', { a: [] }));

        component.changeGroupsBasedOnRadioValue(PryVisibilityType.RESTRICTED);
        expect(spy).toHaveBeenCalledWith([]);

        component.changeGroupsBasedOnRadioValue(PryVisibilityType.PUBLIC);
        component.changeGroupsBasedOnRadioValue(PryVisibilityType.RESTRICTED);
        expect(spy).toHaveBeenCalledWith([]);

        expect(component.assignedGroupNames$.getValue()).toEqual([]);
        expect(component.assignedGroups$).toBeObservable(hot('a', { a: [] }));
      });
    });
  });
});
