import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAttributeConditionComponent } from '../../../../../mock/components/admin/abac/mock-pry-attribute-condition.component';
import { MockPryMetadataConditionComponent } from '../../../../../mock/components/admin/abac/mock-pry-metadata-condition.component';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPryToggleComponent } from '../../../../../mock/components/mock-pry-toggle.component';
import { MockNgModelDirective } from '../../../../../mock/directive/mock-ng-model.directive';
import { MockPryOverlayDirective } from '../../../../../mock/directive/mock-pry-overlay.directive';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { AbacRulesConditions, NormalizedCondition } from '../../store/abac-rules.model';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';
import { ComposedConditionComponent } from './composed-condition.component';

describe('ComposedConditionComponent', () => {
  let component: ComposedConditionComponent;
  let fixture: ComponentFixture<ComposedConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComposedConditionComponent,
        MockTranslatePipe,
        MockPryToggleComponent,
        MockPryOverlayDirective,
        MockPryMetadataConditionComponent,
        MockPryAttributeConditionComponent,
        MockPryIconComponent,
        MockNgModelDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: AbacRulesSelectors.editAbacRuleConditions,
              value: {
                masterId: 'id',
                ids: ['id', 'id1', 'id2'],
                entities: {
                  id: { id: 'id', type: 'AND', composed: ['id1'] } as NormalizedCondition,
                  id1: { id: 'id1', type: 'ATTRIBUTE' } as NormalizedCondition,
                  id2: { id: 'id2', type: 'METADATA' } as NormalizedCondition
                }
              } as AbacRulesConditions
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposedConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create condition container div for composed', async () => {
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    const div = fixture.debugElement.query(By.css('.o-pry-composed-condition-wrapper')).nativeElement;
    expect(div).toBeTruthy();
  });
  it('should add new nested item for composed', async () => {
    const spy = jest.spyOn(component, 'onAddNewNestedCondition');
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    const button = fixture.debugElement.query(By.css('.a-btn.a-btn--iconcircle-text')).nativeElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
  });
  it('should create condition container div for attribute', async () => {
    component.id = 'id1';
    fixture.detectChanges();
    await fixture.whenStable();
    const div = fixture.debugElement.query(By.css('pry-attribute-condition')).nativeElement;
    expect(div).toBeTruthy();
    const attribute = fixture.debugElement.query(By.directive(MockPryAttributeConditionComponent)).nativeElement;
    expect(attribute).toBeTruthy();
  });
  it('should create condition container div for metadata', async () => {
    component.id = 'id2';
    fixture.detectChanges();
    await fixture.whenStable();
    const div = fixture.debugElement.query(By.css('pry-metadata-condition')).nativeElement;
    expect(div).toBeTruthy();
    const metadata = fixture.debugElement.query(By.directive(MockPryMetadataConditionComponent)).nativeElement;
    expect(metadata).toBeTruthy();
  });
});
