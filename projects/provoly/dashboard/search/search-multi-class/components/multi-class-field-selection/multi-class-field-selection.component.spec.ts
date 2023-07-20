import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors, Field, FieldSelectors, FieldType } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockFilterPipe } from '../../../../mock/pipe/mock-filter.pipe';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { SearchMultiClassSelectors } from '../../store/search-multi-class.selectors';
import { SearchMultiClassService } from '../../store/search-multi-class.service';
import { MultiClassFieldSelectionComponent } from './multi-class-field-selection.component';

const fields = [
  {
    id: 'id',
    name: 'name',
    type: FieldType.INTEGER
  } as Field,
  {
    id: 'id2',
    name: 'name2',
    type: FieldType.DECIMAL
  } as Field
];
describe('MultiClassFieldSelectionComponent', () => {
  let component: MultiClassFieldSelectionComponent;
  let fixture: ComponentFixture<MultiClassFieldSelectionComponent>;
  let service: SearchMultiClassService;
  let spy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MultiClassFieldSelectionComponent,
        MockTranslatePipe,
        MockFilterPipe,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: FieldSelectors.fields,
              value: fields
            },
            {
              selector: ClassSelectors.classes,
              value: []
            },
            {
              selector: SearchMultiClassSelectors.conditions,
              value: []
            }
          ]
        }),
        {
          provide: SearchMultiClassService,
          useValue: {
            getFieldsAvailable: () => fields
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiClassFieldSelectionComponent);
    service = TestBed.inject(SearchMultiClassService);
    spy = jest.spyOn(service, 'getFieldsAvailable');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call getFieldsAvailable', () => {
    const conditionId = 'conditionId';
    component.conditionId = conditionId;
    fixture.detectChanges();
    expect(spy.mock.calls).toEqual([
      [[], [], fields, undefined],
      [[], [], fields, undefined],
      [[], [], fields, conditionId],
      [[], [], fields, conditionId]
    ]);
  });
});
