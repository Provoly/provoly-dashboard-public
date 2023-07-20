import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryWidgetTileCssComponent } from '@provoly/dashboard/mock/style/mock-pry-widget-tile-css';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';

import { WidgetTileComponent } from './widget-tile.component';

describe('WidgetImageComponent', () => {
  let component: WidgetTileComponent;
  let fixture: ComponentFixture<WidgetTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetTileComponent, MockI18nPipe, MockPryWidgetTileCssComponent],
      providers: [provideMockStore({ initialState: {} })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
