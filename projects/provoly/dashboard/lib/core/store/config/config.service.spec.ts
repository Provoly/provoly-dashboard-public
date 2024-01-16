import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ConfigSelectors,
  ConfigService,
  ParamContent,
  PryI18nService,
  PrySnackbarService,
  TABLE_ATTR_DOMAIN,
  Widget
} from '@provoly/dashboard';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('Config Service', () => {
  PryI18nService.warn = false;
  ConfigService.warn = false;
  let service: ConfigService;
  let snackbar: PrySnackbarService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MockOverlay,
        ConfigService,
        PrySnackbarService,
        Overlay,
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.refUrl,
              value: 'ref'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(ConfigService);
    snackbar = TestBed.inject(PrySnackbarService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all class params', () => {
    let classParams: ParamContent[] = [];

    service.getAllClassParams().subscribe((params) => (classParams = params));
    const req = httpTestingController.expectOne('ref/customclass/all/param');

    req.flush([
      {
        oClass: 'class',
        domain: TABLE_ATTR_DOMAIN,
        content: '"class-2": ["test 2"]'
      } as ParamContent
    ]);

    expect(classParams).toBeDefined();
    expect(classParams.length).toBe(1);
  });

  it('should save definitions', () => {
    service
      .saveDefinitions({ 'test-class': ['test', 'test 2'], 'test-class-2': ['test 3'] }, TABLE_ATTR_DOMAIN)
      .subscribe(() => {});

    const req = httpTestingController.expectOne('ref/customclass/id/test-class/param/tableAttr');
    const req2 = httpTestingController.expectOne('ref/customclass/id/test-class-2/param/tableAttr');
    req.flush({});
    req2.flush({});
  });

  it('should save widget', () => {
    service
      .saveWidget({
        id: 'test',
        type: 'table',
        name: 'test table',
        description: '',
        image: '',
        content: '',
        datasource: [],
        modificationDate: ''
      } as Widget)
      .subscribe(() => {});

    const req = httpTestingController.expectOne('ref/widget/catalog');
    req.flush({});
  });

  it('should delete widget', () => {
    service.deleteRestitution('test').subscribe(() => {});
    const req = httpTestingController.expectOne('ref/widget/catalog/id/test');
    req.flush({});
  });

  describe('getAllWidgets', () => {
    it('should get all widgets', () => {
      let widgets: Widget[] = [];
      service.getAllWidgets().subscribe((_widgets) => {
        widgets = _widgets;
      });
      const req = httpTestingController.expectOne('ref/widget/catalog');
      req.flush([
        {
          id: 'test',
          type: 'table',
          name: 'test table',
          description: '',
          image: '',
          content: '',
          namedQueries: []
        }
      ]);
      expect(widgets).toBeDefined();
      expect(widgets.length).toBe(1);
    });

    it('should open snackbar on error', () => {
      const spy = jest.spyOn(snackbar, 'notMitigatedOpen').mockReturnValue(null);
      service.getAllWidgets().subscribe({
        next: () => {},
        error: (e) => {}
      });
      const req = httpTestingController.expectOne('ref/widget/catalog');
      req.flush('', { status: 400, statusText: 'Bad Request' });
      expect(spy).toHaveBeenCalled();
    });
  });
});
