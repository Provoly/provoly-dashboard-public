import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';
import { SymbolService } from '../../symbol/symbol.service';

@Pipe({
  name: 'getSecuredImage'
})
export class GetSecuredImagePipe implements PipeTransform {
  constructor(
    private store: Store<any>,
    private translateService: PryI18nService,
    private symbolService: SymbolService
  ) {}

  transform(value: unknown, ...args: unknown[]): Observable<SafeUrl | string> {
    return from(this.symbolService.downloadAsUrl(value as string));
  }
}
