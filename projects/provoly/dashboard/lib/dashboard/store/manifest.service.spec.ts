import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PrySnackbarService } from '../../core/components/snackbar/snackbar.service';
import { PryI18nService } from '../../core/i18n/i18n.service';
import { ManifestService } from './manifest.service';

describe('ManifestService', () => {
  let service: ManifestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({}),
        { provide: PrySnackbarService, useValue: {} },
        { provide: PryI18nService, useValue: {} }
      ]
    });
    service = TestBed.inject(ManifestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
