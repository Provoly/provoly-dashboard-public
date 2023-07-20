import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ImageActions } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';

import { PryUploadComponent } from './upload.component';

describe('PryUploadComponent', () => {
  let component: PryUploadComponent;
  let fixture: ComponentFixture<PryUploadComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [PryUploadComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore()]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call upload service for icons then emit', () => {
    const spyStore = jest.spyOn(store, 'dispatch').mockReturnValue();

    component.onFileSelect({ target: { files: [{ name: 'image.png', type: 'image/png' }] } } as unknown as Event);

    expect(spyStore).toHaveBeenCalledWith(
      ImageActions.add({
        file: {
          name: 'image.png',
          type: 'image/png'
        },
        imageType: 'icon',
        mediaType: 'image/png'
      })
    );
  });

  it('should call upload service for illustration then emit', () => {
    component.mode = 'illustration';

    const spyStore = jest.spyOn(store, 'dispatch').mockReturnValue();

    component.onFileSelect({ target: { files: [{ name: 'image.png', type: 'image/png' }] } } as unknown as Event);

    expect(spyStore).toHaveBeenCalledWith(
      ImageActions.add({
        file: {
          name: 'image.png',
          type: 'image/png'
        },
        imageType: 'illustration',
        mediaType: 'image/png'
      })
    );
  });

  it('should reemit for csv', (done) => {
    component.mode = 'csv';
    const spyStore = jest.spyOn(store, 'dispatch').mockReturnValue();
    component.uploaded.subscribe((name) => {
      expect(name).toEqual('file.csv');
      done();
    });
    component.onFileSelect({ target: { files: [{ name: 'file.csv', type: 'text/csv' }] } } as unknown as Event);
    expect(spyStore).not.toHaveBeenCalled();
  });
});
