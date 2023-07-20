import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Scheduler } from 'jest-marbles';
import { of } from 'rxjs';
import { DashboardActions } from '../../store/dashboard.actions';

import { BusService } from './bus.service';
import { ControlMessageType } from './control-message.interface';

describe('ActionBusService', () => {
  let service: BusService;
  let store: MockStore;

  beforeEach(() => {
    Scheduler.init();
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: {} }), { provide: Router, useValue: { config: [], events: of() } }]
    });
    service = TestBed.inject(BusService);
    store = TestBed.inject(MockStore);
    jest.useFakeTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have defined sender', () => {
    expect(service.sender).toBeDefined();
  });

  it('should react to join message', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    jest.advanceTimersToNextTimer();
    service.manageControlMessage({ type: 'join', sender: 'sender', data: '' });

    expect(dispatchSpy).toHaveBeenCalledWith(DashboardActions.join({ sender: 'sender' }));
  });

  it('should react to leave message', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    jest.advanceTimersToNextTimer();
    service.manageControlMessage({ type: 'leave', sender: 'sender', data: '' });

    expect(dispatchSpy).toHaveBeenCalledWith(DashboardActions.leave({ sender: 'sender' }));
  });

  it('should log unknown message', () => {
    const dispatchSpy = jest.spyOn(console, 'error').mockReturnValue(undefined);
    jest.advanceTimersToNextTimer();
    service.manageControlMessage({ type: 'unknown' as unknown as ControlMessageType, sender: 'sender', data: '' });

    expect(dispatchSpy).toHaveBeenCalledWith('Message type unrecognized', 'unknown');
  });

  it('should log unknown message', () => {
    const dispatchSpy = jest.spyOn(service.dataChannel, 'postMessage').mockReturnValue(undefined);
    jest.advanceTimersToNextTimer();
    service.postData({ type: 'type' });

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'type',
      sender: service.sender
    });
  });
});
