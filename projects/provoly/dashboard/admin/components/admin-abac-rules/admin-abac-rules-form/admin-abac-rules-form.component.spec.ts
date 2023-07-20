import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPrySelectComponent } from '../../../../mock/components/mock-pry-select.component';
import { MockNgFormDirective } from '../../../../mock/directive/mock-ng-form.directive';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { AbacRule } from '../store/abac-rules.model';
import { AbacRulesSelectors } from '../store/abac-rules.selectors';
import { AdminAbacRulesFormComponent } from './admin-abac-rules-form.component';

describe('AdminAbacRulesFormComponent', () => {
  let component: AdminAbacRulesFormComponent;
  let fixture: ComponentFixture<AdminAbacRulesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [
        AdminAbacRulesFormComponent,
        MockTranslatePipe,
        MockNgModelDirective,
        MockPrySelectComponent,
        MockNgFormDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: AbacRulesSelectors.editAbacRule,
              value: { id: 'id', name: 'name' } as AbacRule
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAbacRulesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call changeAbacRuleProperty', () => {
    const spy = jest.spyOn(component, 'onChangeAbacRuleProperty');
    const ngModelInputName = fixture.debugElement.queryAll(By.directive(MockNgModelDirective))[1];
    const ngModelDir = ngModelInputName.injector.get(MockNgModelDirective);
    ngModelDir.ngModelChange.emit('value');
    expect(spy).toHaveBeenCalled();
  });
  it('should call onCreateAbacRule', () => {
    const spy = jest.spyOn(component, 'onCreateAbacRule');
    const button = fixture.debugElement.query(By.css('.a-btn.a-btn--primary')).nativeElement;
    button.click();
    expect(spy).toHaveBeenCalled();
  });
});
