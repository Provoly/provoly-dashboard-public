import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { Class, ClassSelectors, Field, FieldSelectors, MonoClassConditions } from '@provoly/dashboard';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';

const fields = {
  fieldStringId: {
    id: 'fieldStringId',
    name: 'field',
    type: 'string'
  } as Field,
  fieldKeywordId: {
    id: 'fieldKeywordId',
    name: 'field',
    type: 'keyword'
  } as Field,
  fieldDecimalId: {
    id: 'fieldDecimalId',
    name: 'field',
    type: 'decimal'
  } as Field,
  fieldIntegerId: {
    id: 'fieldIntegerId',
    name: 'field',
    type: 'integer'
  } as Field,
  fieldInstantId: {
    id: 'fieldInstantId',
    name: 'field',
    type: 'instant'
  } as Field
};
const classes = {
  classId: {
    id: 'classId',
    name: 'class',
    attributes: [
      {
        id: 'attrStringId',
        field: 'fieldStringId',
        multiValued: false,
        name: 'attr'
      },
      {
        id: 'attrKeywordId',
        field: 'fieldKeywordId',
        multiValued: false,
        name: 'attr'
      },
      {
        id: 'attrDecimalId',
        field: 'fieldDecimalId',
        multiValued: false,
        name: 'attr'
      },
      {
        id: 'attrIntegerId',
        field: 'fieldIntegerId',
        multiValued: false,
        name: 'attr'
      },
      {
        id: 'attrInstantId',
        field: 'fieldInstantId',
        multiValued: false,
        name: 'attr'
      }
    ]
  } as Class
};

describe('PrySearchConditionComponent for string', () => {
  let component: PrySearchConditionComponent;
  let fixture: ComponentFixture<PrySearchConditionComponent>;
  let monoClassCondition: MonoClassConditions = {
    masterId: 'masterId',
    entities: {
      masterId: {
        id: 'masterId',
        parentId: '',
        type: 'ATTRIBUTE',
        operator: 'EQUALS'
      }
    },
    ids: ['masterId']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySearchConditionComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPrySelectComponent,
        MockNgModelDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SearchMonoClassSelectors.selectMonoClassIdSearch,
              value: 'classId'
            },
            {
              selector: SearchMonoClassSelectors.selectMonoClassConditions,
              value: monoClassCondition
            },
            {
              selector: ClassSelectors.entities,
              value: classes
            },
            {
              selector: FieldSelectors.entities,
              value: fields
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get the operator for string attribute', async () => {
    component.attributeId = 'attrStringId';
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
  it('should get the operator for keyword attribute', async () => {
    component.attributeId = 'attrKeywordId';
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
  it('should get the operator for decimal attribute', async () => {
    component.attributeId = 'attrDecimalId';
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
  it('should get the operator for integer attribute', async () => {
    component.attributeId = 'attrIntegerId';
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
  it('should get the operator for date attribute', async () => {
    component.attributeId = 'attrInstantId';
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
  it('should get the operator for string attribute and change operator', async () => {
    component.attributeId = 'attrInstantId';
    component.id = 'masterId';
    fixture.detectChanges();
    await fixture.whenStable();
    const selector = fixture.debugElement.query(By.directive(MockPrySelectComponent));
    const selectorComponent: MockPrySelectComponent = selector.context;
    selectorComponent.writeValue('CONTAINS');
    fixture.detectChanges();
    await fixture.whenStable();
  });
});
