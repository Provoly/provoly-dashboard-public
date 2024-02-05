import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { PryI18nService } from '../../core/i18n/i18n.service';
import { DashboardSelectors } from './dashboard.selectors';

@Injectable({
  providedIn: 'root'
})
export class PryTitleService {
  rank: number = 0;
  displayPageNumber = true;
  pageCount = 0;

  constructor(private title: Title, private translateService: PryI18nService, private store: Store) {
    this.store.select(DashboardSelectors.rank).subscribe((rank) => (this.rank = rank));
    this.store.select(DashboardSelectors.tenants).subscribe((tenants) => (this.pageCount = tenants.length));
  }

  setDisplayPageNumber(display: boolean) {
    this.displayPageNumber = display;
  }

  changeTitle(key?: string) {
    const nextTitle = !!key ? this.translateService.instant(key, {}, false) : this.title.getTitle().split('[')[0];
    const pageNumber =
      this.displayPageNumber && this.pageCount > 1
        ? `[${this.translateService.instant('@pry.view.name', {
            rank: this.rank + 1
          })}]`
        : '';
    this.title.setTitle(`${nextTitle} ${pageNumber}`);
  }
}
