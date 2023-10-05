import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { DashboardActions } from '../../store/dashboard.actions';

import { ManifestsComponent } from './manifests.component';

describe('ManifestsComponent', () => {
  let component: ManifestsComponent;
  let fixture: ComponentFixture<ManifestsComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManifestsComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [
        {
          provide: Store,
          useValue: {
            select: () => of([]),
            dispatch: () => undefined
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetch when clicking', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.fetch('a');
    expect(spy).toHaveBeenCalledWith(DashboardActions.loadAndActivateManifest({ id: 'a' }));
  });

  it('should dispatch delete when clicking', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.delete('a');
    expect(spy).toHaveBeenCalledWith(DashboardActions.deleteManifest({ id: 'a' }));
  });

  it('should dispatch download when clicking', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.download('a', 'name');
    expect(spy).toHaveBeenCalledWith(DashboardActions.downloadManifest({ id: 'a', name: 'name' }));
  });

  it('should dispatch download when clicking', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.triggerFileInput();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle file upload when clicking', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    const event = {
      currentTarget: {
        files: [
          {
            name: 'file.json',
            type: 'application/json'
          }
        ]
      }
    } as unknown as Event;

    const readAsTextSpy = jest.spyOn(window, 'FileReader').mockReturnValue({
      readAsText: function (file) {
        if (!!this && !!this.onload) {
          // @ts-ignore
          this.onload({ target: { result: '{ "windows" :  [] }' } });
        }
      }
    } as FileReader);

    component.handleFileInput(event);
    expect(readAsTextSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      DashboardActions.saveManifest({
        id: 'uuiduuid-this-isis-mock-eduuiduuidaa',
        name: 'file',
        manifest: { windows: [] }
      })
    );
  });
});
