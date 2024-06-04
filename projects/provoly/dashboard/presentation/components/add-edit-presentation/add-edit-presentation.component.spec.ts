import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  DashboardActions,
  DashboardSelectors,
  DEFAULT_DASHBOARD_ICON_URL,
  ManifestDescription
} from '@provoly/dashboard';
import { MockPryCheckboxComponent } from '@provoly/dashboard/mock/components/mock-pry-checkbox.component';
import { MockPrySelectGridLayoutComponent } from '@provoly/dashboard/mock/components/mock-pry-select-grid-layout.component';
import { MockPrySelectImageComponent } from '@provoly/dashboard/mock/components/mock-pry-select-image.component';
import { MockPryDashboardComponent } from '../../../mock/components/mock-pry-dashboard.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockPryUploadComponent } from '../../../mock/components/mock-pry-upload.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { PryAddEditPresentationComponent } from './add-edit-presentation.component';
import { MockPryMetadataEditorComponent } from '@provoly/dashboard/mock/components/mock-pry-metadata-editor.component';
import { MockPryTextEditorComponent } from '@provoly/dashboard/mock/components/mock-pry-text-editor.component';
import { MockPryPresentationFormComponent } from '../../../mock/components/mock-pry-presentation-form.component';

describe('PryAddEditPresentationComponent', () => {
  let component: PryAddEditPresentationComponent;
  let fixture: ComponentFixture<PryAddEditPresentationComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [
        PryAddEditPresentationComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPryDashboardComponent,
        MockPrySelectComponent,
        MockPryUploadComponent,
        MockI18nPipe,
        MockPrySelectImageComponent,
        MockPrySelectGridLayoutComponent,
        MockPryCheckboxComponent,
        MockPryMetadataEditorComponent,
        MockPryTextEditorComponent,
        MockPryPresentationFormComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.manifestsList,
              value: [
                {
                  id: '1',
                  name: 'test',
                  manifestUrl: '/dashboard/manifest/test',
                  creationDate: '2022-01-01',
                  modificationDate: '2022-01-01',
                  default: false
                }
              ]
            },
            {
              selector: DashboardSelectors.staticManifest,
              value: {
                windows: []
              }
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryAddEditPresentationComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    component.selectedPresentation = {
      id: '1',
      name: 'test',
      manifestUrl: '/dashboard/manifest/test',
      creationDate: '2022-01-01',
      modificationDate: '2022-01-01'
    } as ManifestDescription;
    component.formValue = {
      name: 'test',
      description: 'test',
      additionalInformation: 'test',
      image: DEFAULT_DASHBOARD_ICON_URL
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch save action on submit', () => {
    component.selectedPresentation$.next({ id: '1' } as ManifestDescription);
    component.edition = true;
    fixture.detectChanges();
    let date = '2020-01-01T10:10:00';
    jest.useFakeTimers().setSystemTime(new Date(date));
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.save();
    expect(spy).toHaveBeenCalledWith(
      DashboardActions.saveManifest({
        id: '1',
        name: 'test',
        ...component.formValue,
        manifest: {
          windows: []
        },
        metadata: []
      })
    );
  });
});
