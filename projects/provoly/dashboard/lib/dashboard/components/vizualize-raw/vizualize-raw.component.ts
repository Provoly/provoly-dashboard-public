import { Component, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { from, Observable } from 'rxjs';
import { Item } from '../../../core/model/item.interface';
import { RawService } from '../../../core/store/raw/raw.service';

@Component({
  selector: 'pry-vizualize-raw',
  templateUrl: './vizualize-raw.component.html'
})
export class VizualizeRawComponent {
  @Input() item?: Item;
  @Input() propertyName: string = '';
  @Input() alt?: string;
  private _altDefault = 'vizualise-raw';

  get altValue(): string {
    return this.alt ?? this._altDefault;
  }

  constructor(private rawService: RawService) {}

  rawDatas: { [key: string]: { type: string; url: SafeUrl } } = {};

  getRawData(itemId: string, attributeName: string): Observable<{ type: string; url: SafeUrl }> {
    return from(
      new Promise<{ type: string; url: SafeUrl }>((resolve) => {
        setTimeout(() => {
          if (this.rawDatas[itemId + '@' + attributeName]) {
            resolve(this.rawDatas[itemId + '@' + attributeName]);
          } else {
            this.rawDatas[itemId + '@' + attributeName] = { type: '', url: '' };
            this.rawService.get(itemId, attributeName).subscribe((rawData) => {
              this.rawDatas[itemId + '@' + attributeName] = rawData;
              resolve(rawData);
            });
          }
        }, 10);
      })
    );
  }
}
