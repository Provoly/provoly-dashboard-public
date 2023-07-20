// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WidgetManifest } from '@provoly/dashboard';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'pry-widget-instanciator',
  template: '<div>Mock Pry widget instanciator</div>'
})
export class MockPryWidgetInstanciatorComponent {
  // @ts-ignore
  @Input() widgetIndex: number;
  // @ts-ignore
  @Input() staticManifest: WidgetManifest;
  @Input() standalone = false;
  @Output() manifestModified = new EventEmitter<{ widgetIndex: number; manifest: WidgetManifest }>();
  @Input() open$: Observable<void> | Subject<void> = new Subject<void>();
}
