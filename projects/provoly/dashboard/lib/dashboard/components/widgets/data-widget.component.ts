import { Component, ElementRef, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import equal from 'fast-deep-equal/es6';
import { BehaviorSubject, combineLatest, distinctUntilChanged, filter, map, Observable } from 'rxjs';
import { UNKNOWN_DATASOURCE } from '../../../core/components/translate-id/translate-id.pipe';
import { Item } from '../../../core/model/item.interface';
import { ResultSet } from '../../../core/model/result-set.interface';
import { DataSource } from '../../../core/store/data-source/data-source.model';
import { DataSourceSelectors } from '../../../core/store/data-source/data-source.selectors';
import { ResultsetUtils } from '../../resultset-utils';
import { DashboardSelectors } from '../../store/dashboard.selectors';
import { BaseWidgetComponent } from './base-widget.component';
import { NamedQueryTypes } from '../../../core/store/data-source/named-query-types.model';

@Component({ selector: 'pry-data-widget', template: '' })
export class DataWidgetComponent extends BaseWidgetComponent {
  resultSet$: Observable<ResultSet>;
  staticResultSet$ = new BehaviorSubject<ResultSet | null>(null);
  datasourceIds$: Observable<string[]>;
  allItems$: Observable<Item[]>;
  usedDatasources$: Observable<DataSource[]>;

  @Input() set staticResultSet(resultSet: ResultSet) {
    this.staticResultSet$.next(resultSet);
  }

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
    this.datasourceIds$ = this.manifest$.pipe(
      map(
        (manifest) =>
          (Array.isArray(manifest.datasource) ? manifest.datasource : [manifest.datasource]).filter(
            (id) => !!id
          ) as string[]
      )
    );
    this.usedDatasources$ = combineLatest([
      this.datasourceIds$,
      this.store.select(DataSourceSelectors.getDataSources)
    ]).pipe(
      map(
        ([ids, datasources]) =>
          ids
            .map((id) => datasources.find((ds) => ds.id === id) ?? id)
            .map((nq) => (typeof nq !== 'string' ? nq : UNKNOWN_DATASOURCE(nq))) as DataSource[]
      )
    );
    this.resultSet$ = this.initResultSet$();

    this.allItems$ = this.resultSet$.pipe(
      filter((resultSet) => !!resultSet),
      map(
        (resultSet) =>
          Object.keys(resultSet?.items)
            .map((classId) => resultSet.items[classId])
            .reduce((prev, curr) => [...prev, ...curr], []) as Item[]
      )
    );
  }

  initResultSet$() {
    return combineLatest([
      this.store.select(DashboardSelectors.resultSets),
      this.datasourceIds$,
      this.staticResultSet$
    ]).pipe(
      map(([resultSets, resultSetNamesArray, staticResultSet]) => {
        if (!!staticResultSet) {
          return staticResultSet;
        }
        const resultSetArray = resultSetNamesArray
          .map((rsName) => resultSets[rsName ?? ''])
          .filter((rsName) => !!rsName);
        return resultSetArray.reduce((rs1, rs2) => ResultsetUtils.mergeResultSets(rs1, rs2), {
          items: {},
          relations: [],
          merged: resultSetArray.length
        });
      }),
      distinctUntilChanged((p, v) => equal(p, v))
    );
  }
}
