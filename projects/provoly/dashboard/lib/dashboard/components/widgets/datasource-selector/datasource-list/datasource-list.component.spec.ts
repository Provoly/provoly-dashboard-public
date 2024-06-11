import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PryDatasourceListComponent } from './datasource-list.component';
import { MockI18nPipe } from '../../../../../../../dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '../../../../../../../dashboard/mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../../../../dashboard/mock/components/mock-pry-select.component';
import { FormsModule } from '@angular/forms';
import { DataSourceSelectors } from '../../../../../core/store/data-source/data-source.selectors'
import { mockDatasets, mockNamedQueries } from '../../../../../../../dashboard/mock/data/mockDataset';
import { mockCategories } from '../../../../../../../dashboard/mock/data/mockCategories';
import { hot } from 'jest-marbles';
import { MockPryDatasourceCardComponent } from '@provoly/dashboard/mock/components/mock-pry-datasource-card.component';

describe('PryDatasourceListComponent', () => {
  let component: PryDatasourceListComponent;
  let fixture: ComponentFixture<PryDatasourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryDatasourceListComponent, MockPryIconComponent, MockI18nPipe, MockPrySelectComponent, MockPryDatasourceCardComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DataSourceSelectors.getDataSourcesSorted,
              value: [
                ...mockDatasets,
                ...mockNamedQueries
              ]
            },
            {
              selector: DataSourceSelectors.datasets,
              value: mockDatasets
            },
            {
              selector: DataSourceSelectors.categories,
              value: mockCategories
            }
          ]
        })
      ],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryDatasourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('list mode', () => {
    it('should display all datasets by default ', () => {
      expect(component.filteredDatasources$).toBeObservable(
        hot('a', {
          a: [ ...mockDatasets]
        })
      );
    });

    it('should emit consulted dataset when card is clicked', () => {
      const emitterSpy = jest.spyOn(component.consultedDataset, 'emit');

      component.onDatasourceClick({ isSelected: false, datasource: mockDatasets[0] });

      expect(emitterSpy).toHaveBeenCalledWith(mockDatasets[0]);
    });
  });

  describe('selector mode', () => {
    beforeEach(() => {
      component.mode = 'selector';
    });

    it('should display all datasources (datasets and namedqueries) if mode is "selector"', () => {
      component.mode = 'selector';
      fixture.detectChanges();
      expect(component.filteredDatasources$).toBeObservable(
        hot('a', {
          a: [ ...mockDatasets, ...mockNamedQueries].map(ds => ({ ...ds, isSelected: false }))
        })
      );
    });

    it('should preselect all datasources given in input', () => {
      component.selectedDatasources$.next([mockDatasets[0].id]);
      expect(component.filteredDatasources$).toBeObservable(
        hot('a', {
          a: [ ...mockDatasets, ...mockNamedQueries]
            .map(ds => (ds.id === mockDatasets[0].id ? { ...ds, isSelected: true } : { ...ds, isSelected: false }))
        })
      );
    });

    it('should emit list of selected datasources when a list item is clicked', () => {
      component.selectedDatasources$.next([]);
      const selectedDatasources$Spy = jest.spyOn(component.selectedDatasources$, 'next');
      const datasourceSelectedSpy = jest.spyOn(component.datasourceSelected, 'emit');

      component.onDatasourceClick({ isSelected: true, datasource: mockDatasets[0] });
      component.onDatasourceClick({ isSelected: true, datasource: mockDatasets[1] });

      expect(selectedDatasources$Spy).toHaveBeenCalledWith([mockDatasets[0].id]);
      expect(datasourceSelectedSpy).toHaveBeenCalledWith([mockDatasets[0].id]);
    });

    it('should emit empty list if datasource is unselected', () => {
      component.selectedDatasources$.next([mockDatasets[0].id]);
      const selectedDatasources$Spy = jest.spyOn(component.selectedDatasources$, 'next');
      const datasourceSelectedSpy = jest.spyOn(component.datasourceSelected, 'emit');

      component.onDatasourceClick({ isSelected: false, datasource: mockDatasets[0] });

      expect(selectedDatasources$Spy).toHaveBeenCalledWith([]);
      expect(datasourceSelectedSpy).toHaveBeenCalledWith([]);
    });

    it('should always sort datasources by isSelected property', () => {
      component.selectedDatasources$.next([mockDatasets[1].id]);

      expect(component.filteredDatasources$).toBeObservable(hot('a', {
        a: [
          { ...mockDatasets[1], isSelected: true },
          { ...mockDatasets[0], isSelected: false },
          ...mockNamedQueries.map(ds => ({ ...ds, isSelected: ds.id === mockDatasets[1].id }))
        ]
      }));
    });
  });
});
