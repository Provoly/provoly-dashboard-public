import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardSelectors, WidgetManifest } from '@provoly/dashboard';
import { MockPryWidgetIframeCssComponent } from '@provoly/dashboard/mock/style/mock-pry-widget-iframe-css';
import { MockPrySettingsComponent } from '../../../mock/components/mock-pry-settings.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { WidgetIframeComponent } from './widget-iframe.component';

describe('WidgetIframeComponent', () => {
  let component: WidgetIframeComponent;
  let fixture: ComponentFixture<WidgetIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetIframeComponent,
        MockTranslatePipe,
        MockPrySettingsComponent,
        MockI18nPipe,
        MockPryWidgetIframeCssComponent
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    DashboardSelectors.widgetManifest(0).setResult({
      type: 'iframe',
      options: {
        src: 'http://localhost:3000/'
      }
    } as WidgetManifest);
    component.widgetIndex = 0;
    expect(component).toBeTruthy();
  });
});
