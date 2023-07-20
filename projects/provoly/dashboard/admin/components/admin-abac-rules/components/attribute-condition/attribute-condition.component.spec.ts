import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors, FieldSelectors } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../../mock/components/mock-pry-select.component';
import { MockCdkConnectedOverlayDirective } from '../../../../../mock/directive/mock-cdk-connected-overlay.directive';
import { MockCdkOverlayOriginDirective } from '../../../../../mock/directive/mock-cdk-overlay-origin.directive';
import { MockNgModelDirective } from '../../../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { AbacRulesConditions, NormalizedCondition } from '../../store/abac-rules.model';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';
import { AttributeConditionComponent } from './attribute-condition.component';

describe('AttributeConditionComponent', () => {
  let component: AttributeConditionComponent;
  let fixture: ComponentFixture<AttributeConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AttributeConditionComponent,
        MockPryIconComponent,
        MockPrySelectComponent,
        MockNgModelDirective,
        MockCdkConnectedOverlayDirective,
        MockCdkOverlayOriginDirective,
        MockTranslatePipe,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: AbacRulesSelectors.editAbacRuleConditions,
              value: {
                masterId: 'id',
                ids: ['id'],
                entities: { id: { id: 'id', attribute: 'attribute', operator: 'EQUALS' } as NormalizedCondition }
              } as AbacRulesConditions
            },
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'id',
                  attributes: [
                    {
                      id: 'attribute',
                      field: 'field'
                    }
                  ]
                }
              ]
            },
            {
              selector: FieldSelectors.entities,
              value: {
                field: {
                  id: 'field',
                  type: 'integer'
                }
              }
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create div with form', async () => {
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    const container = fixture.debugElement.query(By.css('.o-pry-attribute-condition'));
    expect(container).toBeTruthy();
  });
  it('should update input value', async () => {
    const spy = jest.spyOn(component, 'onChangeValue');
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    const input = fixture.debugElement.queryAll(By.css('input'))[1].nativeElement;
    expect(input).toBeTruthy();
    input.value = 'value';
    input.dispatchEvent(new Event('focusout'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
  });
  it('should openPanel and delete', async () => {
    const spy = jest.spyOn(component, 'onOpenPanel');
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    const icon = fixture.debugElement.query(By.directive(MockPryIconComponent)).nativeElement;
    expect(icon).toBeTruthy();
    icon.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
  });
});
