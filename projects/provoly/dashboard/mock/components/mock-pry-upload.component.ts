// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-upload',
  template: '<p>pry upload</p>'
})
export class MockPryUploadComponent {
  @Input() mode = 'icon';
  @Input() accept: string = 'image/*';
}
