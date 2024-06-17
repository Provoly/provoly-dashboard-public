import { ChipsSelectorComponent } from './chips-selector.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { hot } from 'jest-marbles';
import { PryI18nService } from '../../i18n/i18n.service';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

const stringItems = ['item1', 'item2', 'item3'];

const objItems = [
  { id: 1, name: 'item1' },
  { id: 2, name: 'item2' },
  { id: 3, name: 'item3' }
];

describe('ChipsSelectorComponent', () => {
  let component: ChipsSelectorComponent;
  let fixture: ComponentFixture<ChipsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [ChipsSelectorComponent, MockPryIconComponent, MockI18nPipe],
      providers: [{ provide: PryI18nService, useClass: MockPryI18nService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipsSelectorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('list of strings in input', () => {
    beforeEach(() => {
      component.items = stringItems;
    });

    it('should emit items properly', () => {
      fixture.detectChanges();
      expect(component.items$.getValue()).toEqual(stringItems);
    });

    describe('usedItems$', () => {
      it('should emit empty array if no usedItems provided in input', () => {
        fixture.detectChanges();
        expect(component.usedItems$.getValue()).toEqual([]);
      });

      it('should emit usedItems properly', () => {
        component.usedItems = [stringItems[0]];
        fixture.detectChanges();

        expect(component.usedItems$.getValue()).toEqual([stringItems[0]]);
      });
    });

    describe('unusedItems$', () => {
      it('should emit unused items properly', () => {
        fixture.detectChanges();
        const expected$ = hot('a', {
          a: stringItems
        });

        expect(component.unusedItems$).toBeObservable(expected$);
      });
    });

    describe('toggleItemsSelection', () => {
      it('should select item if it is not in the list of used items', () => {
        const expected$ = hot('a', {
          a: [stringItems[0], stringItems[1]]
        });
        fixture.detectChanges();

        component.toggleItemSelection(stringItems[2]);

        expect(component.usedItems$.getValue()).toEqual([stringItems[2]]);
        expect(component.unusedItems$).toBeObservable(expected$);
      });

      it('should unselect item if it is in the list of used items', () => {
        const expected$ = hot('a', {
          a: stringItems
        });
        component.usedItems = [stringItems[1]];
        fixture.detectChanges();

        component.toggleItemSelection(stringItems[1]);

        expect(component.usedItems$.getValue()).toEqual([]);
        expect(component.unusedItems$).toBeObservable(expected$);
      });
    });
  });

  describe('list of objects in input', () => {
    beforeEach(() => {
      component.items = objItems;
      component.bindValue = 'id';
      component.bindLabel = 'name';
    });

    it('should assert object equality properly based on bindValue property', () => {
      fixture.detectChanges();
      expect(component.areItemsEqual(component.items$.getValue()?.[0], component.items$.getValue()?.[0])).toBe(true);
    });
  });
});
