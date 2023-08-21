import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Category,
  Class,
  ConfigSelectors,
  Environment,
  IMetadata,
  Link,
  LinkDetails,
  MetadataRules,
  MetadataRulesCreate,
  MetadataUser,
  Predicate,
  UserInfo
} from '@provoly/dashboard';
import { mergeMap, Observable } from 'rxjs';
import { AbacRule } from '../components/admin-abac-rules/store/abac-rules.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private httpClient: HttpClient, private store: Store<any>) {}

  getPredicates(): Observable<Predicate[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Predicate[]>(`${url}/predicates`)));
  }

  savePredicate(predicate: Predicate): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(`${url}/predicates`, predicate)));
  }

  getPredicate(id: string): Observable<Predicate> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Predicate>(`${url}/predicates/id/${id}`)));
  }

  getMetadataList(): Observable<any> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<any>(`${url}/metadata`)));
  }

  getMetadata(id: string): Observable<IMetadata> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<IMetadata>(`${url}/metadata/id/${id}`)));
  }

  postMetadata(metadata: IMetadata): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(`${url}/metadata`, metadata)));
  }

  getUserMetadata(): Observable<any> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<any>(`${url}/users/metadata`)));
  }

  getUserMetadataDef(id: string): Observable<IMetadata> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<IMetadata>(`${url}/users/metadata/${id}`)));
  }

  postUserMetadata(metadata: IMetadata): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(`${url}/users/metadata`, metadata)));
  }

  getEnvironments(): Observable<Environment[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Environment[]>(`${url}/abac/context`)));
  }

  saveEnvironment(env: Environment): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.put<void>(`${url}/abac/context`, env)));
  }

  getEnvironment(name: string): Observable<Environment> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Environment>(`${url}/abac/context/${name}`)));
  }

  deleteEnvironment(name: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(`${url}/abac/context/${name}`)));
  }

  getAbacRules(): Observable<AbacRule[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<AbacRule[]>(`${url}/abac/rules`)));
  }

  getAbacRule(id: string): Observable<AbacRule> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<AbacRule>(`${url}/abac/rules/id/${id}`)));
  }

  saveAbacRule(rule: AbacRule): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(`${url}/abac/rules`, rule)));
  }

  getClass(id: string): Observable<Class> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Class>(`${url}/model/class/id/${id}`)));
  }

  saveClass(clazz: Class): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/model/class`), clazz)));
  }

  saveAttributeForClass(classId: string, attribute: Attribute): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) => this.httpClient.put<void>(encodeURI(`${url}/model/class/id/${classId}/attribute`), attribute))
      );
  }

  deleteClass(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/model/class/id/${id}`))));
  }

  deleteAttributeForClass(classId: string, attrId: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.delete<void>(encodeURI(`${url}/model/class/id/${classId}/attribute/id/${attrId}`))
        )
      );
  }

  saveCategory(category: Category): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.put<void>(encodeURI(`${url}/model/categories`), category)));
  }

  getUsers(): Observable<UserInfo[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<UserInfo[]>(`${url}/users`)));
  }

  getMetadataUser(userId: string): Observable<MetadataUser[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<MetadataUser[]>(`${url}/users/id/${userId}/metadata`)));
  }

  addMetadataUser(userId: string, metaId: string, value: any): Observable<void> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) =>
        this.httpClient.put<void>(encodeURI(`${url}/users/id/${userId}/metadata/id/${metaId}`), {
          value: value
        })
      )
    );
  }

  deleteMetadataUser(userId: string, metaId: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/users/id/${userId}/metadata/id/${metaId}`)))
      );
  }

  getLinks(): Observable<LinkDetails[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<LinkDetails[]>(`${url}/links`)));
  }

  saveLink(link: Link): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/links`), link)));
  }

  addMetadataRules(metadataRules: MetadataRulesCreate): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/meta-provisionning`), metadataRules)));
  }

  getMetadataRulesList(): Observable<MetadataRules[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<MetadataRules[]>(`${url}/meta-provisionning`)));
  }

  getMetadataRules(id: string): Observable<MetadataRules> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<MetadataRules>(`${url}/meta-provisionning/id/${id}`)));
  }

  deleteMetadataRules(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<MetadataRules>(`${url}/meta-provisionning/id/${id}`)));
  }
}
