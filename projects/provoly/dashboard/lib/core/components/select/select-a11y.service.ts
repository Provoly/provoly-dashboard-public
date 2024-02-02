import { EmbeddedViewRef } from '@angular/core';
import { FocusOrigin } from '@angular/cdk/a11y';

export class SelectA11yService {
  protected toggle = (...args: any[]) => {};
  public setToggle(toggleCallback: (...args: any[]) => void) {
    this.toggle = toggleCallback;
  }

  onFocusChange(origin: FocusOrigin, autocomplete: boolean, toggleFocus: () => void, focusSelect: () => void) {
    toggleFocus();
    switch (origin) {
      case 'mouse':
        if (!autocomplete) {
          this.toggle(true);
        }
        break;
      case 'keyboard':
        if (autocomplete) {
          focusSelect();
        }
        break;
    }
  }

  onKeydownSelect(event: KeyboardEvent, autocomplete: boolean) {
    if (!autocomplete) {
      if (event.key === 'Enter' || event.code === 'Space') {
        this.toggle();
      }
    }
  }

  onKeydownAutocompleteInput(
    event: KeyboardEvent,
    open: boolean,
    searchValue: string,
    optionsModalRef?: EmbeddedViewRef<any>
  ) {
    if (event.key === 'Tab') {
      if (open) this.toggle();
      return;
    }

    if (!open && searchValue?.length > 2 && event.key.length === 1) {
      this.toggle();
    } else if (open && event.key === 'Enter') {
      this.toggle();
    } else if (open && event.key === 'ArrowDown') {
      optionsModalRef?.rootNodes[0].querySelector('[aria-selected="false"]').focus();
    }
  }

  onKeydownOption(
    event: KeyboardEvent,
    optionDivRef: HTMLDivElement,
    first: boolean,
    last: boolean,
    autocomplete: boolean,
    selectElement: HTMLDivElement,
    select: () => void
  ) {
    switch (event.key) {
      case 'Enter':
      case 'Space':
      case ' ':
        event.preventDefault();
        select();
        break;
      case 'ArrowUp':
        if (!first) {
          event.preventDefault();
          (optionDivRef.previousElementSibling as HTMLDivElement).focus();
        }
        if (first && autocomplete) {
          selectElement.focus();
        }
        break;
      case 'ArrowDown':
        if (!last) {
          event.preventDefault();
          (optionDivRef.nextElementSibling as HTMLDivElement).focus();
        }
        if (last && autocomplete) {
          // with autocomplete=true, focus is not trapped, so prevent tabbing out of list
          event.preventDefault();
        }
        break;
      case 'Tab':
        if (last && autocomplete) {
          event.preventDefault();
        }
        break;
      case 'Escape':
        this.toggle();
        break;
      default:
        break;
    }
  }

  focusInitialSelection(optionsModalRef?: EmbeddedViewRef<any>) {
    let selectedOption: HTMLDivElement =
      optionsModalRef?.rootNodes[0].querySelector('[aria-selected="true"]') ??
      optionsModalRef?.rootNodes[0].querySelector('[aria-selected="false"]');
    selectedOption?.setAttribute('cdkFocusInitial', '');
  }
}
