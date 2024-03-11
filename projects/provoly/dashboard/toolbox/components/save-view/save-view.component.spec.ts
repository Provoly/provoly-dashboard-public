import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigActions, DashboardActions, ManifestDescription } from '@provoly/dashboard';
import { MockPryAccessDirective } from '@provoly/dashboard/mock/directive/mock-pry-access.directive';
import { of } from 'rxjs';
import * as uuid from 'uuid';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { SaveViewComponent } from './save-view.component';

describe('SaveViewComponent', () => {
  let component: SaveViewComponent;
  let fixture: ComponentFixture<SaveViewComponent>;
  let store: Store;
  let overlay: Overlay;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveViewComponent, MockPryIconComponent, MockTranslatePipe, MockI18nPipe, MockPryAccessDirective],
      providers: [
        provideMockStore({}),
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
    overlay = TestBed.inject(Overlay);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display then hide overlay name on submit', () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    jest.spyOn(uuid, 'v4').mockImplementationOnce(() => 'id');
    component.currentManifest = {
      name: 'name',
      image: 'http://...',
      description: 'description'
    } as ManifestDescription;
    component.saveAsOpened = true;
    component.save();
    jest.advanceTimersByTime(1000);
    expect(component.saveAsOpened).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(DashboardActions.requestAllRoutes());
    expect(spy).toHaveBeenCalledWith(ConfigActions.closeOverlay({ id: 'SaveViewComponent' }));
    expect(spy).toHaveBeenCalledWith(
      DashboardActions.saveManifest({
        id: 'id',
        name: 'name',
        description: 'description',
        image: 'http://...',
        groups: []
      })
    );
  });
});
