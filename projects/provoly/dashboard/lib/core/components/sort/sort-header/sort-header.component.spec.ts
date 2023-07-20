import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrySortHeaderDirective } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';

import { PrySortHeaderComponent } from './sort-header.component';

describe('SortHeaderComponent', () => {
  let component: PrySortHeaderComponent;
  let fixture: ComponentFixture<PrySortHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrySortHeaderComponent, MockPryIconComponent, PrySortHeaderDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySortHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
