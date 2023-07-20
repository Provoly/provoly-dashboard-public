import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors, Image, ImageService, PryI18nService, PrySnackbarService } from '@provoly/dashboard';

describe('Config Service', () => {
  let service: ImageService;
  let httpTestingController: HttpTestingController;
  let domSanitizer: DomSanitizer;
  PryI18nService.warn = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.dataUrl,
              value: 'data'
            }
          ]
        }),
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => {}
          }
        }
      ]
    });
    service = TestBed.inject(ImageService);
    httpTestingController = TestBed.inject(HttpTestingController);
    domSanitizer = TestBed.inject(DomSanitizer);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all images', () => {
    let images: Image[] = [];

    service.getImages().subscribe((_images) => (images = _images));
    const req = httpTestingController.expectOne('data/file/icons');

    req.flush([
      {
        image: 'test-image.png',
        type: ['icon', 'test']
      },
      {
        image: 'test-image-2.png',
        type: ['icon']
      }
    ]);

    expect(images).toBeDefined();
    expect(images.length).toBe(2);
  });

  describe('getImage', () => {
    it('should get an image', () => {
      global.URL.createObjectURL = jest.fn(() => 'test');
      let response: any = {};
      const blob = new Blob(['test'], { type: 'image' });
      const mockResponse = new HttpResponse({
        headers: new HttpHeaders({ 'Content-Type': 'image' }),
        body: blob
      });

      service.getImage('test-image.png').subscribe((_response) => {
        response = _response;
      });
      const req = httpTestingController.expectOne('data/file/icons/test-image.png');
      expect(req.request.responseType).toEqual('blob');

      req.event(mockResponse);
      expect(response.type).toBe('image');
      expect(response.url).toEqual(domSanitizer.bypassSecurityTrustUrl('test'));
    });

    it('should throw error if header doesnt include image/video', (done) => {
      const blob = new Blob(['test'], { type: 'audio' });
      const mockResponse = new HttpResponse({
        headers: new HttpHeaders({ 'Content-Type': 'audio' }),
        body: blob
      });

      service.getImage('test').subscribe({
        next: () => {},
        error: (e) => {
          expect(e.type).toBe('unknown');
          expect(e.error).toBe('unknown doc type');
          done();
        }
      });

      const req = httpTestingController.expectOne('data/file/icons/test');
      req.event(mockResponse);
      httpTestingController.verify();
    });
  });

  describe('file upload', () => {
    it('should upload a file', () => {
      service.upload(new File(['test'], 'test-file'), 'image/png', 'image').subscribe();

      const req = httpTestingController.expectOne('data/file/icons');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.has('File-Content-Type')).toEqual(true);

      req.flush('test');
      httpTestingController.verify();
    });

    it('should throw error on any other error than 409', (done) => {
      service.upload(new File(['test'], 'test-file'), 'image/png', 'image').subscribe({
        error: (e) => {
          expect(e.status).toEqual(404);
          expect(e.statusText).toEqual('Bad Request');
          done();
        }
      });

      const req = httpTestingController.expectOne('data/file/icons');
      req.flush({ error: 'bad request' }, { status: 404, statusText: 'Bad Request' });
      httpTestingController.verify();
    });
  });
});
