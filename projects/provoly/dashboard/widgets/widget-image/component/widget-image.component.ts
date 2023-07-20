import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseWidgetComponent, ImageWidgetOptions } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'pry-widget-image',
  templateUrl: './widget-image.component.html'
})
export class WidgetImageComponent extends BaseWidgetComponent {
  options$: Observable<ImageWidgetOptions>;
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
    this.options$ = this.manifest$.pipe(map((manifest) => manifest.options as ImageWidgetOptions));
  }

  override toImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = this.image.nativeElement.width;
      canvas.height = this.image.nativeElement.height;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(this.image.nativeElement, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    });
  }
}
