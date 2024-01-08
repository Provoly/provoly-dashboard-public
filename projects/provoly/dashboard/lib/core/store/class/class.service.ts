import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, Observable } from 'rxjs';
import { ConfigSelectors } from '../config/config.selectors';
import { Class } from './class.interface';
import { DatasetCount } from '../../model/dataset.interface';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private httpClient: HttpClient, private store: Store<any>) {}

  /**
   * Returns the list of business classes
   */
  getClasses(): Observable<Array<Class>> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Array<Class>>(encodeURI(`${url}/model/class`))));
  }

  getDatasetCounts(): Observable<DatasetCount[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<DatasetCount[]>(encodeURI(`${url}/model/class/datasets/count`))));
  }
}
