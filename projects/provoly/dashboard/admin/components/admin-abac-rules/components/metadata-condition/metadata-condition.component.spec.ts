import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { IMetadata } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../../../mock/components/mock-pry-select.component';
import { MockNgModelDirective } from '../../../../../mock/directive/mock-ng-model.directive';
import { MockPryOverlayDirective } from '../../../../../mock/directive/mock-pry-overlay.directive';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { MetadataSelectors } from '../../../admin-metadata/store/metadata.selector';
import { AbacRulesConditions, NormalizedCondition } from '../../store/abac-rules.model';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';
import { MetadataConditionComponent } from './metadata-condition.component';

describe('MetadataConditionComponent', () => {
  let component: MetadataConditionComponent;
  let fixture: ComponentFixture<MetadataConditionComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [
        MetadataConditionComponent,
        MockPryIconComponent,
        MockPrySelectComponent,
        MockPryOverlayDirective,
        MockNgModelDirective,
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
                entities: { id: { id: 'id', metadata: 'metadata', operator: 'EQUALS' } as NormalizedCondition }
              } as AbacRulesConditions
            },
            {
              selector: MetadataSelectors.metadata,
              value: [{ id: 'metadata', type: 'INTEGER' } as IMetadata]
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataConditionComponent);
    store = TestBed.inject(Store);
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
    const container = fixture.debugElement.query(By.css('.o-pry-metadata-condition'));
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
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    const icon = fixture.debugElement.query(By.directive(MockPryIconComponent)).nativeElement;
    expect(icon).toBeTruthy();
    icon.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.deleteConditionOpen).toEqual(true);
  });
});
