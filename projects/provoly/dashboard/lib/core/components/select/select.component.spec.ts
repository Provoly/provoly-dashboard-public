import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { PrySelectComponent } from './select.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';

describe('SelectComponent', () => {
  let component: PrySelectComponent;
  let fixture: ComponentFixture<PrySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrySelectComponent, MockNgModelDirective, MockI18nPipe, MockPryIconComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
