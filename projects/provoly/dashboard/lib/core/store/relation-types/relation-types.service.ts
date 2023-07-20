import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable } from 'rxjs';
import { Relation } from '../../model/relation.interface';
import { ConfigSelectors } from '../config/config.selectors';
import { RelationType } from './relation-types.interface';

@Injectable({
  providedIn: 'root'
})
export class RelationTypesService {
  constructor(
    private store: Store,
    private httpClient: HttpClient
  ) {}

  addRelationType(id: string, name: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(`${url}/relation-types`, { id: id, name: name })));
  }

  getRelationsTypes(): Observable<RelationType[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<RelationType[]>(`${url}/relation-types`)));
  }

  deleteRelationType(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(`${url}/relation-types/id/${id}`)));
  }

  createRelation(
    sources: string[],
    destination: string,
    relationType: string,
    inversion: boolean
  ): Observable<Relation[]> {
    let relations: any = [];
    if (inversion) {
      relations = sources.map((source) => ({ source: destination, destination: source, relationType }));
    } else {
      relations = sources.map((source) => ({ destination, source, relationType }));
    }
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) => this.httpClient.post<void>(`${url}/relations`, relations)),
      map(() => relations)
    );
  }
}
