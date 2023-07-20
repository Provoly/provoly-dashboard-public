// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';
import { HeaderAction } from '@provoly/dashboard';

@Component({
  selector: 'pry-widget-header',
  template: '<div>Mock Pry widget header</div>'
})
export class MockPryWidgetHeaderComponent {
  @Input() manifest: any;
  @Input() widgetIndex: any;
  @Input() additionalOptions: HeaderAction[] | null = [];
  @Input() headerOptions: { [key: string]: boolean } | {} | undefined;
  @Input() datasourceIds$: any;
  @Input() displayCount: boolean = true;
  menuOpen: () => any = () => {};
}
