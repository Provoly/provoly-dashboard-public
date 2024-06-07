import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Overlay } from '@angular/cdk/overlay';
import { PryDatasetComponent, PryDatasetCssComponent, PryDatasetDetailComponent } from '@provoly/dashboard/dataset';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockPryTabGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-tab-group.component';
import { MockPryTabComponent } from '@provoly/dashboard/mock/components/mock-pry-tab.component';
import { Dataset, PryDatasetType, ViewMode } from '@provoly/dashboard';

export const mockDataset = {
  name: 'test-ds',
  sourceType: 'dataset',
  id: 'test-ds-id',
  oClass: 'test-class',
  type: PryDatasetType.OPEN,
  metadata: [],
  slug: 'test-ds-id-slug'
} as Dataset;

describe('PryDatasetComponent', () => {
  let component: PryDatasetComponent;
  let fixture: ComponentFixture<PryDatasetComponent>;
  let store: MockStore;
  let overlay: Overlay;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryDatasetComponent,
        PryDatasetDetailComponent,
        PryDatasetCssComponent,
        MockI18nPipe,
        MockPryIconComponent,
        MockNgModelDirective,
        MockPryTabGroupComponent,
        MockPryTabComponent
      ],
      providers: [provideMockStore({}), { provide: Overlay }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryDatasetComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    overlay = TestBed.inject(Overlay);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select dataset and change to consult mode when dataset clicked', () => {
    component.consult(mockDataset);
    expect(component.selectedDataset).toEqual(mockDataset);
    expect(component.selectedMode).toEqual(ViewMode.CONSULT);
  });
});
