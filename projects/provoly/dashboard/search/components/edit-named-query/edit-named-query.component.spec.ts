import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryChooseWidgetComponent } from '../../../mock/components/search/mock-pry-chose-widget.component';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { EditNamedQueryComponent } from './edit-named-query.component';

describe('EditNamedQueryComponent', () => {
  let component: EditNamedQueryComponent;
  let fixture: ComponentFixture<EditNamedQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNamedQueryComponent, MockPryChooseWidgetComponent, MockTranslatePipe],
      providers: [provideMockStore()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNamedQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
