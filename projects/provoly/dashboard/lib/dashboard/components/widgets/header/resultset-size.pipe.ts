import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { PryI18nService } from '../../../../core/i18n/i18n.service';
import { DashboardSelectors } from '../../../store/dashboard.selectors';

@Pipe({
  name: 'resultSetSize'
})
export class ResultSetSizePipe implements PipeTransform {
  constructor(
    private store: Store,
    private translate: PryI18nService
  ) {}

  transform(_name: string | string[]): Observable<string> {
    const names = Array.isArray(_name) ? _name : [_name];
    return combineLatest(names.map((name) => this.calculate(name))).pipe(
      map((values) => {
        return values.reduce(
          (p, c) => ({
            displayed: p.displayed + c.displayed,
            total: p.total + c.total,
            accurate: p.accurate && c.accurate
          }),
          { total: 0, accurate: true, displayed: 0 }
        );
      }),
      map((values) =>
        this.translate.instant(
          values.displayed === values.total
            ? '@pry.widget.namedQuery.resultsAccurate'
            : '@pry.widget.namedQuery.resultsNonAccurate',
          values
        )
      )
    );
  }

  calculate(name: string): Observable<{ displayed: number; total: number; accurate: boolean }> {
    return this.store.select(DashboardSelectors.resultSets).pipe(
      map((resultSets) => {
        const displayed = Object.values(resultSets[name]?.items || {})
          .map((items) => items.length)
          .reduce((p, c) => p + c, 0);

        return Object.values(resultSets[name]?.count || {}).reduce<{
          displayed: number;
          total: number;
          accurate: boolean;
        }>(
          (p, c) => ({
            displayed: displayed,
            total: p.total + c.count,
            accurate: p.accurate && c.accurate
          }),
          { displayed: 0, accurate: true, total: 0 }
        );
      })
    );
  }
}
