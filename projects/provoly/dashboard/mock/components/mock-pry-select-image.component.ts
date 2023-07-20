import { OverlayRef } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Image, ImageState, LibraryTypes } from '@provoly/dashboard';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'pry-select-image',
  template: '<p>pry mock</p>'
})
export class MockPrySelectImageComponent {
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  overlayRef?: OverlayRef;
  @Output() toggled = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<string>();
  @Input() iconUrl = '';
  @Input() size = 50;
  @Input() mode: string = LibraryTypes.ICON;
  id: number = 0;
  images$?: Observable<Image[]>;
  loading$: Observable<ImageState> = new Subject();
}
