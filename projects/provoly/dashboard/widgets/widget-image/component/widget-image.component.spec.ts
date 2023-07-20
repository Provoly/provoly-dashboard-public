import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryWidgetImageCssComponent } from '../../../mock/style/mock-pry-widget-image-css';

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
