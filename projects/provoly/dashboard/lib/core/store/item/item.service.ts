import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, Observable } from 'rxjs';
import { ItemUtils } from '../../../dashboard/item-utils';
import { Item } from '../../model/item.interface';
import { ResultSet } from '../../model/result-set.interface';
import { ConfigSelectors } from '../config/config.selectors';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(
    private store: Store,
    private httpClient: HttpClient
  ) {}

  /**
   * Get item's detail by id
   * @param id
   */
  get(id: string): Observable<Item> {
    return this.store
      .select(ConfigSelectors.dataUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Item>(encodeURI(`${url}/items/id/${id}`))));
  }

  /**
   * Returns all items connected by a relation to the node of this id
   * @param id
   */
  proximity(id: string): Observable<ResultSet> {
    return this.store
      .select(ConfigSelectors.dataUrl)
      .pipe(mergeMap((url) => this.httpClient.get<ResultSet>(encodeURI(`${url}/items/id/${id}/relations`))));
  }

  create(item: Item, datasetVersionId: string, mode = 'MERGE'): Observable<Item[]> {
    const toSendItem = {
      ...ItemUtils.ensureItemIdHasCorrectFormat(item),
      datasetVersionId
    };
    return this.store
      .select(ConfigSelectors.dataUrl)
      .pipe(
        mergeMap((url) => this.httpClient.post<Item[]>(`${url}/items`, [toSendItem], { params: { updateMode: mode } }))
      );
  }
}
