import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryNotificationCssComponent } from '@provoly/dashboard/mock/style/mock-pry-notification-css';

import { PryNotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: PryNotificationComponent;
  let fixture: ComponentFixture<PryNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PryNotificationComponent, MockI18nPipe, MockPryNotificationCssComponent],
      providers: [provideMockStore({}), { provide: Overlay, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
