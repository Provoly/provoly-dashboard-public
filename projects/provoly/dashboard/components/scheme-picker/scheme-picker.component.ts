import { AfterViewInit, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrySchemeService } from './scheme.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PryI18nService } from '@provoly/dashboard';

@Component({
  selector: 'pry-scheme-picker',
  templateUrl: './scheme-picker.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrySchemePickerComponent),
      multi: true
    }
  ]
})
export class PrySchemePickerComponent implements ControlValueAccessor, AfterViewInit {
  onChange: any = () => {};
  onTouch: any = () => {};
  scheme$ = new BehaviorSubject<string>('Provoly');
  schemes$: Observable<{ id: string; label: string }[]>;
  inhibate = true;
  disabled = false;
  schemeColors$: Observable<string[]>;

  constructor(
    private _cd: ChangeDetectorRef,
    private schemeService: PrySchemeService,
    private i18nService: PryI18nService
  ) {
    this.schemes$ = this.schemeService.schemeIds$.pipe(
      map((schemes) => {
        let customNumber = 1;
        return schemes.map((scheme, idx) => ({
          id: scheme,
          label:
            scheme.indexOf('#') === 0 ? this.i18nService.instant('@pry.widget.custom', { id: customNumber++ }) : scheme
        }));
      })
    );
    this.schemeColors$ = this.scheme$.pipe(map((scheme) => this.schemeService.getSchemeColors(scheme)));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  // Define what should happen in this component, if something changes outside
  writeValue(scheme: string) {
    if (this.scheme$.getValue() !== scheme && !this.inhibate) {
      this.scheme$.next(scheme);
      this.onChange(this.scheme$.getValue());
      this.onTouch();
      this._cd.markForCheck();
      this.schemeService.assertScheme(this.scheme$.getValue());
      this.temporaryDisable();
    }
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
    this._cd.markForCheck();
  }

  temporaryDisable() {
    this.inhibate = true;
    setTimeout(() => {
      this.inhibate = false;
    }, 100);
  }

  ngAfterViewInit(): void {
    this.temporaryDisable();
  }

  changeColorScheme($event: any) {
    if ($event === '#') {
      this.writeValue(this.schemeService.getSchemeColors(this.schemeService.getDefaultScheme()).join(','));
    } else {
      this.writeValue($event);
    }
  }

  modifyColorScheme($event: string, index: number) {
    if (!this.inhibate) {
      const newScheme = [...this.schemeService.getSchemeColors(this.scheme$.getValue())];
      newScheme[index] = $event;
      this.writeValue(newScheme.join(','));
    }
  }

  addColorToScheme() {
    this.writeValue(
      this.schemeService
        .getSchemeColors(this.scheme$.getValue())
        .concat('#' + this.schemeService.randomColor())
        .join(',')
    );
  }

  removeColorFromScheme(index: number) {
    const newScheme = [...this.schemeService.getSchemeColors(this.scheme$.getValue())];
    newScheme.splice(index, 1);
    this.writeValue(newScheme.join(','));
  }
}
