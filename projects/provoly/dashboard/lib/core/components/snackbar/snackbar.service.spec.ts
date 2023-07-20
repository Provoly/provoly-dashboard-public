import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';

import { PrySnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
  let service: PrySnackbarService;
  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => ({ instance: { actionClicked: of(undefined) }, destroy: () => undefined }),
    dispose: () => undefined
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        },
        {
          provide: PryI18nService,
          useValue: {
            instant: (a: string) => `<translated>${a}`
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(PrySnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be able to set root view', () => {
    const viewRef = { id: 'factory' } as unknown as ViewContainerRef;
    service.setRootViewContainerRef(viewRef);
    expect(service.rootViewContainer).toEqual(viewRef);
  });

  it('should be able to open snack and close it automatically', () => {
    jest.useFakeTimers();

    const viewRef = {
      insert: () => ({ id: 'viewref' }),
      remove: () => undefined,
      indexOf: () => 0
    } as unknown as ViewContainerRef;
    const spyRemove = jest.spyOn(mockOverlayRef, 'dispose');

    service.setRootViewContainerRef(viewRef);
    const ref = service.open({ message: 'message', type: 'info' });
    expect(ref).toBeDefined();
    expect(PrySnackbarService.count).toEqual(1);

    jest.runAllTimers();
    expect(PrySnackbarService.count).toEqual(0);
    expect(spyRemove).toHaveBeenCalledTimes(1);
  });
});
