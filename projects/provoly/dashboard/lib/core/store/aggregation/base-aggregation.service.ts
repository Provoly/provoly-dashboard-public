import { Injectable } from '@angular/core';
import { ChartAggregatedWidgetOptions, Operation, ValueType } from '@provoly/dashboard';
import { Observable } from 'rxjs';

export interface AggregationResult {
  operation: Operation;
  values: (
    | {
        key: ValueType;
        value: ValueType;
      }
    | {
        key: ValueType;
        groupBy: {
          key: ValueType;
          value: ValueType;
        }[];
      }
    | {
        key: ValueType;
        value: {
          bottom_right: { lon: string; lat: string };
          top_left: { lon: string; lat: string };
        };
      }
  )[];
}

@Injectable({
  providedIn: 'root'
})
export class PryAggregationService {
  aggregate(datasource: string[], options: ChartAggregatedWidgetOptions): Observable<AggregationResult> {
    throw new Error(
      'You must declare the use of an aggregation service. Add PryBackendAggregationService, PryFrontendAggregationService or a custom service'
    );
  }
}
