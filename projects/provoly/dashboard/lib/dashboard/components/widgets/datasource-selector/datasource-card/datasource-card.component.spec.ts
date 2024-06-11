import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { PryDatasourceCardComponent } from './datasource-card.component';
import { MockI18nPipe } from '../../../../../../../dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '../../../../../../../dashboard/mock/components/mock-pry-icon.component';
import { MockTranslateIdPipe } from '../../../../../../../dashboard/mock/pipe/mock-translate-id.pipe';
import { mockDatasets } from '../../../../../../mock/data/mockDataset';

describe('PryDatasourceCardComponent', () => {
  let component: PryDatasourceCardComponent;
  let fixture: ComponentFixture<PryDatasourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryDatasourceCardComponent, MockPryIconComponent, MockI18nPipe, MockTranslateIdPipe],
      providers: [
        provideMockStore({})
      ],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryDatasourceCardComponent);
    component = fixture.componentInstance;
    component.datasource = mockDatasets[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('if card is selectable, once clicked, it should emit the ds and isSelected value', () => {
    component.isSelectable = true;
    const methodSpy = jest.spyOn(component, 'onClick');
    const emitterSpy = jest.spyOn(component.clicked, 'emit');
    const toClick = fixture.debugElement.query(By.css('div.o-datasource-card'));

    toClick.nativeElement.click();

    expect(methodSpy).toHaveBeenCalled();
    expect(emitterSpy).toHaveBeenCalledWith({ isSelected: true, datasource: mockDatasets[0] });
  });

  it('if card is not selectable, once clicked, it should emit the ds and isSelected always equal to false ', () => {
    component.isSelectable = false;
    const methodSpy = jest.spyOn(component, 'onClick');
    const emitterSpy = jest.spyOn(component.clicked, 'emit');
    const toClick = fixture.debugElement.query(By.css('div.o-datasource-card'));

    toClick.nativeElement.click();

    expect(methodSpy).toHaveBeenCalled();
    expect(emitterSpy).toHaveBeenCalledWith({ isSelected: false, datasource: mockDatasets[0] });
  });
});
