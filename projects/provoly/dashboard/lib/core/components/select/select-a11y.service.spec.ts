import { SelectA11yService } from './select-a11y.service';
import SpyInstance = jest.SpyInstance;
import { EmbeddedViewRef } from '@angular/core';
import { mockEvent } from '@provoly/dashboard/mock/data/mockEvent';

describe('SelectA11yService', () => {
  let a11y: SelectA11yService;
  let toggleSpy: SpyInstance;

  beforeEach(() => {
    a11y = new SelectA11yService();
    a11y.setToggle(() => {});
    toggleSpy = jest.spyOn(a11y as any, 'toggle');
  });

  describe('onFocusChange', () => {
    let toggleFocus: () => void;
    let focusInput: () => void;

    beforeEach(() => {
      toggleFocus = jest.fn();
      focusInput = jest.fn();
    });

    it('should toggle focus', () => {
      a11y.onFocusChange('mouse', false, toggleFocus, focusInput);
      expect(toggleFocus).toHaveBeenCalled();
    });

    describe('when focus comes from mouse', () => {
      it('should toggle dropdown, if no autocomplete', () => {
        a11y.onFocusChange('mouse', false, toggleFocus, focusInput);
        expect(toggleSpy).toHaveBeenCalled();
      });

      // @TODO this is not correct behavior i think
      it('should not toggle dropdown, if autocomplete active', () => {
        a11y.onFocusChange('mouse', true, toggleFocus, focusInput);
        expect(toggleSpy).not.toHaveBeenCalled();
      });
    });

    describe('when focus comes from keyboard', () => {
      // when autocomplete is active we always want to shift focus from the container div to input
      it('should focus input if autocomplete active', () => {
        a11y.onFocusChange('keyboard', true, toggleFocus, focusInput);
        expect(toggleFocus).toHaveBeenCalled();
      });

      it('should not focus input if no autocomplete', () => {
        a11y.onFocusChange('keyboard', false, toggleFocus, focusInput);
        expect(focusInput).not.toHaveBeenCalled();
      });
    });
  });

  describe('onKeyDownSelect (called on keydown when select container is in focus)', () => {
    describe('when autocomplete is active', () => {
      it('should never toggle dropdown', () => {
        a11y.onKeydownSelect({ key: 'Space' } as KeyboardEvent, true);
        expect(toggleSpy).not.toHaveBeenCalled();
        a11y.onKeydownSelect({ key: 'Enter' } as KeyboardEvent, true);
        expect(toggleSpy).not.toHaveBeenCalled();
        a11y.onKeydownSelect({ key: 'ArrowDown' } as KeyboardEvent, true);
        expect(toggleSpy).not.toHaveBeenCalled();
        a11y.onKeydownSelect({ key: 'ArrowUp' } as KeyboardEvent, true);
        expect(toggleSpy).not.toHaveBeenCalled();
      });
    });

    describe('when autocomplete is not active', () => {
      it('should toggle dropdown when space is pressed', () => {
        a11y.onKeydownSelect({ code: 'Space' } as KeyboardEvent, false);
        expect(toggleSpy).toHaveBeenCalled();
      });

      it('should toggle dropdown when enter is pressed', () => {
        a11y.onKeydownSelect({ key: 'Enter' } as KeyboardEvent, false);
        expect(toggleSpy).toHaveBeenCalled();
      });

      it('should not toggle dropdown when arrow up or arrow down is pressed', () => {
        a11y.onKeydownSelect({ key: 'ArrowUp' } as KeyboardEvent, false);
        expect(toggleSpy).not.toHaveBeenCalled();
        a11y.onKeydownSelect({ key: 'ArrowDown' } as KeyboardEvent, false);
        expect(toggleSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('onKeydownAutocompleteInput (called on keydown when autocomplete input is in focus)', () => {
    const searchedValue = 'searched value';

    describe('when Tab key is pressed', () => {
      it('should close dropdown to allow tabbing away', () => {
        a11y.onKeydownAutocompleteInput({ key: 'Tab' } as KeyboardEvent, true, searchedValue);
        expect(toggleSpy).toHaveBeenCalled();
      });

      it('should never open input', () => {
        a11y.onKeydownAutocompleteInput({ key: 'Tab' } as KeyboardEvent, false, searchedValue);
        expect(toggleSpy).not.toHaveBeenCalled();
      });
    });

    describe('when alphanumeric or Backspace key is pressed', () => {
      it('should open dropdown', () => {
        a11y.onKeydownAutocompleteInput({ key: 'A' } as KeyboardEvent, false, searchedValue);
        expect(toggleSpy).toHaveBeenCalled();
      });
    });

    describe('when ArrowDown key is pressed', () => {
      it('should focus first element in dropdown ', () => {
        const optionList = document.createElement('div');
        const listElement = document.createElement('div');
        listElement.setAttribute('aria-selected', 'false');
        optionList.append(listElement);
        const mockDropdownRef = { rootNodes: [optionList] } as EmbeddedViewRef<any>;

        const toBeFocused = mockDropdownRef.rootNodes[0].querySelector('[aria-selected="false"]');
        const spy = jest.spyOn(toBeFocused, 'focus');

        a11y.onKeydownAutocompleteInput({ key: 'ArrowDown' } as KeyboardEvent, true, searchedValue, mockDropdownRef);
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('onKeydownOption (called on keydown when a dropdown item is in focus)', () => {
    const select = jest.fn();
    let optionDivRef: HTMLDivElement & { previousElementSibling: any; nextElementSibling: any };
    let selectElement: HTMLDivElement;

    beforeEach(() => {
      optionDivRef = {
        ...document.createElement('div'),
        nextElementSibling: document.createElement('div'),
        previousElementSibling: document.createElement('div')
      };
      selectElement = document.createElement('div');
    });

    describe('when Enter or Space key is pressed', () => {
      it('should call the select() method passed in param (to select element in focus)', () => {
        a11y.onKeydownOption(
          { key: 'Enter', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          false,
          false,
          false,
          selectElement,
          select
        );
        expect(select).toHaveBeenCalled();
      });
    });

    describe('when ArrowUp key is pressed', () => {
      it('should focus previous item, if current item is not first', () => {
        const spy = jest.spyOn(optionDivRef.previousElementSibling as HTMLDivElement, 'focus');
        a11y.onKeydownOption(
          { key: 'ArrowUp', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          false,
          false,
          false,
          selectElement,
          select
        );
        expect(spy).toHaveBeenCalled();
      });

      it('should focus back the select element, if current item is first and autocomplete is active (to allow text input)', () => {
        const spy = jest.spyOn(selectElement, 'focus');
        a11y.onKeydownOption(
          { key: 'ArrowUp', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          true,
          false,
          true,
          selectElement,
          select
        );
        expect(spy).toHaveBeenCalled();
      });

      it('should not shift focus if currentElement is first and autocomplete is not active)', () => {
        const spy = jest.spyOn(selectElement, 'focus');
        a11y.onKeydownOption(
          { key: 'ArrowUp', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          true,
          false,
          false,
          selectElement,
          select
        );
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('when ArrowDown key is pressed', () => {
      it('should focus next item, if current item is not last', () => {
        const spy = jest.spyOn(optionDivRef.nextElementSibling, 'focus');
        a11y.onKeydownOption(
          { key: 'ArrowDown', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          false,
          false,
          false,
          selectElement,
          select
        );
        expect(spy).toHaveBeenCalled();
      });
      it('should not shift focus if were on the last element of the list and autocomplete=true', () => {
        const spy = jest.spyOn(optionDivRef.nextElementSibling, 'focus');
        a11y.onKeydownOption(
          { key: 'ArrowDown', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          false,
          true,
          true,
          selectElement,
          select
        );
        expect(spy).not.toHaveBeenCalled();
      });
    });
    describe('when Tab key is pressed', () => {
      it('should not shift focus if were on the last element of the list and autocomplete=true', () => {
        const event = { key: 'Tab', ...mockEvent } as KeyboardEvent;
        const focusSpy = jest.spyOn(optionDivRef.nextElementSibling, 'focus');
        expect(focusSpy).not.toHaveBeenCalled();

        const eventSpy = jest.spyOn(event, 'preventDefault');

        a11y.onKeydownOption(event, optionDivRef, false, true, true, selectElement, select);

        expect(focusSpy).not.toHaveBeenCalled();
        expect(eventSpy).toHaveBeenCalled();
      });
    });
    describe('when Esc key is pressed', () => {
      it('should close the dropdown list', () => {
        a11y.onKeydownOption(
          { key: 'Escape', ...mockEvent } as KeyboardEvent,
          optionDivRef,
          false,
          false,
          false,
          selectElement,
          select
        );
        expect(toggleSpy).toHaveBeenCalled();
      });
    });
  });
});
