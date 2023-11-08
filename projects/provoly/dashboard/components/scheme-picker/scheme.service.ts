import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {VegaColorType} from '@provoly/dashboard';
import {vega} from 'vega-embed';

@Injectable({ providedIn: 'root' })
export class PrySchemeService {
  schemeIds$ = new BehaviorSubject<string[]>([]);

  constructor() {
    vega.scheme('KO/W/OK', ['#C04D3F', '#FD9843', '#9ABE29']);
    vega.scheme('Provoly', ['#113B6E', '#4E92E4', '#40B688', '#7BCCAD', '#FFC971', '#FD9843', '#EC547A']);
    this.schemeIds$.next(Object.values(VegaColorType));
  }

  getSchemeColors(scheme: string): string[] {
    if (!scheme) {
      return this.getSchemeColors(this.getDefaultScheme());
    }
    if (scheme.indexOf('#') === 0) {
      return scheme.split(',').map((color) => (color.indexOf('#') === 0 ? color : `#${color}`));
    }
    return vega.scheme(scheme) as string[];
  }

  getDefaultScheme() {
    return this.schemeIds$.getValue()[0];
  }

  randomColor() {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
        .toUpperCase()
    );
  }

  assertScheme(scheme: string) {
    if (!!scheme) {
      if (scheme.indexOf('#') === 0) {
        vega.scheme(scheme, scheme.split(','));
        this.schemeIds$.next([...new Set([...this.schemeIds$.getValue(), scheme])]);
      }
    }
  }
}
