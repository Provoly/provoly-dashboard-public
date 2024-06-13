import { Pipe, PipeTransform } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Item } from '../../model/item.interface';
import { SymbolService } from '../../symbol/symbol.service';

@Pipe({
  name: 'translateItemToSymbol'
})
export class TranslateItemToSymbolPipe implements PipeTransform {
  constructor(private symbolService: SymbolService) {}

  transform(value: Item, ...args: unknown[]): Observable<string> {
    return from(
      new Promise<string>((resolve) =>
        this.symbolService.getSymbol(value).then((canvas) => resolve(canvas.toDataURL('image/png')))
      )
    );
  }
}
