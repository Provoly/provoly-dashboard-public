// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ManifestDescription } from '@provoly/dashboard';

@Component({
  selector: 'pry-presentation-form',
  template: '<p>pry selector</p>'
})
export class MockPryPresentationFormComponent {
  @Input() mode: 'theme' | 'meta' = 'meta';
  @Input() themePrefix: string | null = null;
  @Input() set selectedPresentation(presentation: any) {}
}
