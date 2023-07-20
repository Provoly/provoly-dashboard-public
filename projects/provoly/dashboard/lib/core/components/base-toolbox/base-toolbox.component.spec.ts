import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPryBaseToolboxActionComponent } from '../../../../mock/components/mock-pry-base-toolbox-action.component';
import { BaseToolboxComponent } from './base-toolbox.component';

describe('BaseToolboxComponent', () => {
  let component: BaseToolboxComponent;
  let fixture: ComponentFixture<BaseToolboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseToolboxComponent, MockPryBaseToolboxActionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
