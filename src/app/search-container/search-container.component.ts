import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardManifest,
  DEFAULT_NAMED_QUERY_ID,
  SubscriptionnerDirective
} from '@provoly/dashboard';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent extends SubscriptionnerDirective {
  manifest: DashboardManifest = {
    widgets: []
  };

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    super();
    this.store.dispatch(
      DashboardActions.updateResultSet({ id: DEFAULT_NAMED_QUERY_ID, resultSet: { items: {}, relations: [] } })
    );
  }
}
