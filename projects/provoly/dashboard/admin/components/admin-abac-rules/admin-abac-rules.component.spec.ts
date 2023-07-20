import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { AdminAbacRulesComponent } from './admin-abac-rules.component';
import { AbacRule } from './store/abac-rules.model';
import { AbacRulesSelectors } from './store/abac-rules.selectors';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

@Pipe({ name: 'prySortData' })
class MockPrySortData implements PipeTransform {
  transform(value: []): [] {
    return value;
  }
}

const abacRules: AbacRule[] = [
  {
    active: true,
    description: 'desc',
    id: 'id',
    name: 'name',
    predicate: 'uuid1',
    type: 'ATTRIBUTE'
  },
  {
    active: true,
    description: 'desc',
    id: 'id2',
    name: 'name2',
    predicate: 'uuid2',
    type: 'METADATA'
  }
];

describe('AdminAbacRulesComponent', () => {
  let component: AdminAbacRulesComponent;
  let fixture: ComponentFixture<AdminAbacRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdminAbacRulesComponent, MockTranslatePipe, MockPrySortData, MockPryIconComponent, MockI18nPipe],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: AbacRulesSelectors.abacRules,
              value: [...abacRules]
            },
            {
              selector: AbacRulesSelectors.loading,
              value: false
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAbacRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
