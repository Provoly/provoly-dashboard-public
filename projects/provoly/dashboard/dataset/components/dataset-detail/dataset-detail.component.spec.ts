import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Overlay } from '@angular/cdk/overlay';
import { PryDatasetDetailComponent } from '@provoly/dashboard/dataset';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockPryTooltipDirective } from '@provoly/dashboard/mock/directive/mock-pry-tooltip.directive';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockPryTabGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-tab-group.component';
import { MockPryTabComponent } from '@provoly/dashboard/mock/components/mock-pry-tab.component';
import { mockDataset } from '../dataset.component.spec';
import { DataSourceActions, SearchActions } from '@provoly/dashboard';

export const mockDatasetVersion = {
  id: 'test-id',
  dataset: 'test-ds-id',
  oClass: 'test-class',
  lastModified: '2023-01-20',
  available: true,
  version: 10,
  state: 'ERROR',
  withFile: false,
  metadata: [],
  hasWarnings: false
};

describe('PryDatasetDetailComponent', () => {
  let component: PryDatasetDetailComponent;
  let fixture: ComponentFixture<PryDatasetDetailComponent>;
  let store: MockStore;
  let overlay: Overlay;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryDatasetDetailComponent,
        MockI18nPipe,
        MockPryIconComponent,
        MockPryTooltipDirective,
        MockNgModelDirective,
        MockPryTabGroupComponent,
        MockPryTabComponent
      ],
      providers: [provideMockStore({}), { provide: Overlay }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryDatasetDetailComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    overlay = TestBed.inject(Overlay);
    component.dataset = mockDataset;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh both datasources and dataset versions', () => {
    const spyDsItems = jest.spyOn(SearchActions, 'getDatasourceItems');
    const spyDsVersions = jest.spyOn(DataSourceActions.dataset, 'listVersions');

    component.refresh();

    expect(spyDsItems).toHaveBeenCalledWith({ id: mockDataset.id });
    expect(spyDsVersions).toHaveBeenCalled();
  });

  describe('should handle CTA action based on datasetVersion.state', () => {
    it('should open error modal if version has errors', () => {
      const spy = jest.spyOn(component, 'consultErrors');

      component.handleButtonAction(mockDatasetVersion);

      expect(spy).toHaveBeenCalled();
      expect(component.selectedDatasetVersion).toEqual(mockDatasetVersion);
      expect(component.showModalStatus).toBe(true);
    });

    it('should deactivate version, if version is active', () => {
      // @ts-expect-error
      const spyMethod = jest.spyOn(component, 'deactivateVersion');
      const spyStoreMethod = jest.spyOn(DataSourceActions.dataset, 'deactivateDatasetVersion');

      component.handleButtonAction({ ...mockDatasetVersion, state: 'ACTIVE' });

      expect(spyMethod).toHaveBeenCalled();
      expect(spyStoreMethod).toHaveBeenCalledWith({
        datasetId: 'test-ds-id',
        versionId: mockDatasetVersion.id
      });
    });

    it('should activate version, if version is inactive', () => {
      // @ts-expect-error
      const spyMethod = jest.spyOn(component, 'activateVersion');
      const spyStoreMethod = jest.spyOn(DataSourceActions.dataset, 'activateDatasetVersion');

      component.handleButtonAction({ ...mockDatasetVersion, state: 'INACTIVE' });

      expect(spyMethod).toHaveBeenCalled();
      expect(spyStoreMethod).toHaveBeenCalledWith({
        datasetId: 'test-ds-id',
        versionId: mockDatasetVersion.id
      });
    });
  });
});
