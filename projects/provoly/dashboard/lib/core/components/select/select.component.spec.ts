import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgModelDirective } from '../../../../mock/directive/mock-ng-model.directive';
import { PrySelectComponent } from './select.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';

@Component({
  selector: 'ng-select',
  template: '<div>ng-select mock</div>'
})
class MockNgSelectComponent {
  @Input() readonly?: any;
  @Input() appendTo?: any;
  @Input() multiple?: any;
  @Input() closeOnSelect?: any;
  @Input() items?: any;
  @Input() bindValue?: any;
  @Input() bindLabel?: any;
  @Input() clearable?: any;
  @Input() searchable?: any;
  @Input() placeholder: any;
  @Input() required: any;
  @Input() clearAllText: any;
}

describe('SelectComponent', () => {
  let component: PrySelectComponent;
  let fixture: ComponentFixture<PrySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrySelectComponent, MockNgSelectComponent, MockNgModelDirective, MockI18nPipe]
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
