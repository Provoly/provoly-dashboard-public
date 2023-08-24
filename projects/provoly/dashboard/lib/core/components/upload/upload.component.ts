import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { ImageActions } from '../../store/image/image.actions';
import { ImagesSelectors } from '../../store/image/image.selectors';
import { LibraryTypes } from '../../store/image/image.service';
import { RawService } from '../../store/raw/raw.service';

@Component({
  selector: 'pry-upload',
  templateUrl: './upload.component.html'
})
export class PryUploadComponent {
  @Input() mode = 'icon';
  @Input() accept: string = 'image/*';
  @Input() labelTranslate: string = '@pry.action.upload';
  @Output() uploaded = new EventEmitter<string>();
  @Output() uploadedFile = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private store: Store, private rawService: RawService) {}

  onFileSelect($event: Event) {
    // @ts-ignore
    const files = $event?.target.files;
    if (files.length > 0) {
      switch (this.mode) {
        case LibraryTypes.ICON:
          this.store.dispatch(
            ImageActions.add({
              file: files[0],
              mediaType: files[0].type,
              imageType: LibraryTypes.ICON
            })
          );
          this.asyncEmit(files[0]);
          break;
        case LibraryTypes.ILLUSTRATION:
          this.store.dispatch(
            ImageActions.add({
              file: files[0],
              mediaType: files[0].type,
              imageType: LibraryTypes.ILLUSTRATION
            })
          );
          this.asyncEmit(files[0]);
          break;
        case 'files':
          this.uploaded.emit(files[0].name);
          this.uploadedFile.emit(files[0]);
          break;
        default:
          this.rawService.upload(files[0], files[0].name, files[0].type).subscribe((id) => {
            this.uploaded.emit(id);
            this.uploadedFile.emit(files[0]);
          });
      }
    }
    this.fileInput.nativeElement.value = null;
  }

  asyncEmit(file: File) {
    const tmpSub = this.store
      .select(ImagesSelectors.lastAdded)
      .pipe(filter((image) => !!image))
      .subscribe((name) => {
        this.uploaded.emit(name);
        this.uploadedFile.emit(file);
        setTimeout(() => {
          tmpSub.unsubscribe();
          this.store.dispatch(ImageActions.clearAdded());
        }, 100);
      });
  }
}
