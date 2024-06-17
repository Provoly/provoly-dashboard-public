import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { DashboardSelectors } from '../../../store/dashboard.selectors';
import { SettingsComponent } from './settings.component';
import { MockOverlay, mockOverlayRef } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent, MockPryIconComponent, MockTranslatePipe, MockI18nPipe],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: DashboardSelectors.dashboardCellParams,
              value: {
                gridWidth: 1517,
                gridHeight: 518,
                gridGap: 2,
                columns: 12,
                cellHeight: 50,
                rows: 10,
                cellWidth: 124.58333333333333,
                offsetLeft: 0,
                offsetTop: 63
              }
            }
          ]
        }),
        { provide: Overlay, useClass: MockOverlay }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    component.widgetIndex = 0;
    DashboardSelectors.widgetManifest(0).setResult({
      type: 'placeholder',
      layout: {
        x: 2,
        y: 2,
        width: 3,
        height: 4
      }
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save and close', () => {
    const spy = jest.spyOn(component.saveTriggered, 'emit').mockReturnValue(undefined);
    const spyOverlayRef = jest.spyOn(mockOverlayRef, 'dispose');
    component.toggle();
    component.saveAndClose();
    expect(component.open).toBeFalsy();
    expect(spy).toHaveBeenCalledWith();
    expect(spyOverlayRef).toHaveBeenCalled();
  });
});
