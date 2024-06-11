import { Pipe, PipeTransform } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { from, Observable } from 'rxjs';
import { SymbolService } from '../../symbol/symbol.service';

@Pipe({
  name: 'getSecuredImage'
})
export class GetSecuredImagePipe implements PipeTransform {
  constructor(private symbolService: SymbolService) {}

  transform(value: unknown, ...args: unknown[]): Observable<SafeUrl | string> {
    return from(this.symbolService.downloadAsUrl(value as string));
  }
}
