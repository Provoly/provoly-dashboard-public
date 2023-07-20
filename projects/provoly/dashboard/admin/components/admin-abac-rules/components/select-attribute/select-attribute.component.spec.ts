import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors } from '@provoly/dashboard';
import { AbacRulesSelectors } from '../../store/abac-rules.selectors';
import { SelectAttributeComponent } from './select-attribute.component';

describe('SelectAttributeComponent', () => {
  let component: SelectAttributeComponent;
  let fixture: ComponentFixture<SelectAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectAttributeComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ClassSelectors.classes,
              value: [{ id: 'class', attributes: [{ id: 'attribute' }] }]
            },
            {
              selector: AbacRulesSelectors.editAbacRuleConditionsFirstAttribute,
              value: 'attribute'
            },

            {
              selector: ClassSelectors.classByAttributeId('attribute'),
              value: { id: 'class', attributes: [{ id: 'attribute' }] }
            },
            {
              selector: AbacRulesSelectors.editAbacRuleConditionsFirstAttribute,
              value: 'class'
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onSelectAttribute', () => {
    const spy = jest.spyOn(component, 'onSelectAttribute');
    const element = fixture.debugElement.query(By.css('.m-pry-overlay-item'));
    element.nativeElement.click();
    expect(spy.mock.calls).toEqual([['class', 'attribute']]);
  });
});
