import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';

import { WidgetPlaceholderComponent } from './widget-placeholder.component';

describe('WidgetPlaceholderComponent', () => {
  let component: WidgetPlaceholderComponent;
  let fixture: ComponentFixture<WidgetPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetPlaceholderComponent, MockI18nPipe],
      providers: [provideMockStore({ initialState: {} })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
