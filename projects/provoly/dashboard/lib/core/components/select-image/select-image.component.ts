import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConfigActions } from '../../store/config/config.actions';
import { Image, ImageActions } from '../../store/image/image.actions';
import { ImageState } from '../../store/image/image.reducer';
import { ImagesSelectors } from '../../store/image/image.selectors';
import { LibraryTypes } from '../../store/image/image.service';

let uniqueId = 0;

@Component({
  selector: 'pry-select-image',
  templateUrl: './select-image.component.html'
})
export class PrySelectImageComponent implements OnInit {
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  overlayRef?: OverlayRef;
  @Output() toggled = new EventEmitter<boolean>();
  @Output() changed = new EventEmitter<string>();
  @Input() iconUrl = '';
  @Input() size = 25;
  @Input() mode: string = LibraryTypes.ICON;
  id: number;
  images$?: Observable<Image[]>;
  loading$: Observable<ImageState>;

  constructor(private store: Store, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    this.store.dispatch(ImageActions.load());
    this.id = uniqueId++;
    this.loading$ = this.store.select(ImagesSelectors.images);
  }

  ngOnInit() {
    this.images$ = this.store.select(ImagesSelectors.imageWithFilter(this.mode));
  }

  toggleImageChoice($event?: MouseEvent) {
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['image-choice-menu', `image-choice-menu-${this.id}`]
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: 'ImageChoice' }));
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
      this.overlayRef.backdropClick().subscribe(() => this.toggleImageChoice());
      const contextMenu = document.querySelector(`.image-choice-menu-${this.id}`) as HTMLDivElement;
      if (!!contextMenu && !!$event) {
        contextMenu.style.left = $event.clientX - 30 + 'px';
        contextMenu.style.top = $event.clientY - 30 + 'px';
      }
      this.toggled.next(true);
    } else {
      this.store.dispatch(ConfigActions.closeOverlay({ id: 'ImageChoice' }));
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
      this.toggled.next(false);
    }
  }

  changeForImage(icon: string) {
    const newImage = 'internal:' + icon;
    this.changed.next(newImage);
    if (this.overlayRef) {
      this.changed.next(icon);
      this.toggleImageChoice();
    }
  }
}
