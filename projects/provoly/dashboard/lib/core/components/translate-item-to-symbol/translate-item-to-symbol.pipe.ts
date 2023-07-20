import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { from, Observable } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';
import { Item } from '../../model/item.interface';
import { ImageService } from '../../store/image/image.service';
import { SymbolService } from '../../symbol/symbol.service';

@Pipe({
  name: 'translateItemToSymbol'
})
export class TranslateItemToSymbolPipe implements PipeTransform {
  constructor(
    private store: Store<any>,
    private translateService: PryI18nService,
    private imageService: ImageService,
    private symbolService: SymbolService
  ) {}

  transform(value: Item, ...args: unknown[]): Observable<string> {
    return from(
      new Promise<string>((resolve) =>
        this.symbolService.getSymbol(value).then((canvas) => resolve(canvas.toDataURL('image/png')))
      )
    );
  }
}
