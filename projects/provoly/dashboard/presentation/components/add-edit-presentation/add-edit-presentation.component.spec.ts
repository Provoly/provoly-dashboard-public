import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DashboardActions, DashboardSelectors, ManifestDescription } from '@provoly/dashboard';
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
        MockPryMetadataEditorComponent
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
                  description: 'test descr',
                  cover: false,
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
      description: 'test descr',
      cover: false,
      manifestUrl: '/dashboard/manifest/test',
      creationDate: '2022-01-01',
      modificationDate: '2022-01-01',
      default: false
    } as ManifestDescription;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch save action on submit', () => {
    component.selectedPresentation = {} as ManifestDescription;
    fixture.detectChanges();
    let date = '2020-01-01T10:10:00';
    jest.useFakeTimers().setSystemTime(new Date(date));
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.save();
    expect(spy).toHaveBeenCalledWith(
      DashboardActions.saveManifest({
        name: '',
        description: '',
        cover: false,
        image: '/assets/svgs/default-restitution.svg',
        manifest: {
          windows: []
        }
      })
    );
  });
});
