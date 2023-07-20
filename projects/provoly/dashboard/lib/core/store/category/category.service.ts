import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';
import { Category } from './category.interface';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '../config/config.selectors';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>
  ) {}

  getCategories(): Observable<Array<Category>> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Array<Category>>(encodeURI(`${url}/model/categories`))));
  }
}
