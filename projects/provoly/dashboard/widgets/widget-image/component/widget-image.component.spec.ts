import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { WidgetImageComponent } from './widget-image.component';

describe('WidgetImageComponent', () => {
  let component: WidgetImageComponent;
  let fixture: ComponentFixture<WidgetImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetImageComponent, MockPryWidgetImageCssComponent],
      providers: [provideMockStore({ initialState: {} })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
