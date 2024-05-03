import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigSelectors } from '../../../store/config/config.selectors';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { PryAccessRightsShareComponent } from './access-rights-share.component';
import { MockPrySelectComponent } from '@provoly/dashboard/mock/components/mock-pry-select.component';

const groups = [
  {
    id: '1',
    system: true,
    name: 'ALL',
    label: '@pry.share.groups.ALL'
  },
  {
    id: '4',
    system: false,
    name: 'CUSTOM-GROUP',
    label: 'CUSTOM-GROUP'
  },
  {
    id: '11',
    system: true,
    name: 'CUSTOM-GROUP-2',
    label: '@pry.share.groups.CUSTOM-GROUP-2'
  }
];

const groupNames = groups.map((group) => group.name);

describe('PryAccessRightsShareComponent', () => {
  let component: PryAccessRightsShareComponent;
  let fixture: ComponentFixture<PryAccessRightsShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [PryAccessRightsShareComponent, MockI18nPipe, MockPrySelectComponent],
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
    fixture = TestBed.createComponent(PryAccessRightsShareComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('writeValue', () => {
    it('should transform input format (api format) to component format', () => {
      component.writeValue({ 'CUSTOM-GROUP': ['READ'] });
      fixture.detectChanges();

      // { group: string[] } -> { group: string }
      expect(component.value).toEqual({ 'CUSTOM-GROUP': 'READ' });
    });
  });

  describe('groups$', () => {
    it('should return all groups if no groups assigned', () => {
      fixture.detectChanges();
      const expected$ = hot('a', {
        a: groups
      });
      expect(component.groups$).toBeObservable(expected$);
    });

    it('should return only groups that are not assigned', () => {
      component.assignedGroups$.next(['CUSTOM-GROUP']);
      fixture.detectChanges();

      const expected$ = hot('a', {
        a: groups.filter((group) => group.name !== 'CUSTOM-GROUP')
      });
      expect(component.groups$).toBeObservable(expected$);
    });
  });

  describe('addAccess', () => {
    it('should add group to the value with the selected access level', () => {
      // mock user selecting group
      component.selectedGroups = [{ name: 'CUSTOM-GROUP', system: false, id: 'id' }];
      // mock user selecting access rights
      component.selectedAccessRight = 'WRITE';

      component.addAccess();
      expect(component.value).toEqual({ 'CUSTOM-GROUP': 'WRITE' });
    });

    it('should reset group selection and reset accessRight to default (READ) once new entry added', () => {
      const spy = jest.spyOn(component, 'resetSelection');
      component.selectedGroups = [{ name: 'CUSTOM-GROUP', system: false, id: 'id' }];
      component.selectedAccessRight = 'WRITE';

      component.addAccess();
      expect(spy).toHaveBeenCalled();
      expect(component.selectedGroups).toBeUndefined();
      expect(component.selectedAccessRight).toEqual('READ');
    });
  });

  describe('removeGroupAccess', () => {
    it('should remove group from the value', () => {
      // mock user selecting group
      component.writeValue({ 'CUSTOM-GROUP': ['READ'], 'CUSTOM-GROUP-2': ['WRITE'] });

      component.removeGroupAccess('CUSTOM-GROUP');
      expect(component.value).toEqual({ 'CUSTOM-GROUP-2': 'WRITE' });
    });
  });
});
