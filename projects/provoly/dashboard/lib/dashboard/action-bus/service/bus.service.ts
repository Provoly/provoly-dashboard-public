import { Injectable, NgZone } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { v4 } from 'uuid';
import { DashboardActions } from '../../store/dashboard.actions';
import { BusAction } from '../bus-action.interface';
import { ControlMessage, ControlMessageType } from './control-message.interface';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  sender: string;
  dataChannel: BroadcastChannel;
  controlChannel: BroadcastChannel;
  buffer: Action[];

  constructor(
    private store: Store<any>,
    private zone: NgZone
  ) {
    this.sender = new Date().toISOString() + v4();
    this.dataChannel = new BroadcastChannel('data');
    this.controlChannel = new BroadcastChannel('control');
    this.buffer = [];

    // Dispatch any message received on the data channel as they must be ngrx actions
    this.dataChannel.onmessage = (msg) => {
      if (!msg.data.target || msg.data.target === this.sender) {
        // if broadcast or i am the target
        this.store.dispatch({ ...msg.data });
      }
    };
    this.dataChannel.onmessageerror = (msg) => {
      throw new Error(JSON.stringify(msg));
    };

    this.controlChannel.onmessage = (msg) =>
      this.zone.run(() => {
        this.manageControlMessage(msg.data);
      });
    this.dataChannel.onmessageerror = (msg) => {
      throw new Error(JSON.stringify(msg));
    };

    window.onbeforeunload = () => this.postControl('leave', { sender: this.sender });

    setTimeout(() => {
      this.store.dispatch(
        DashboardActions.declareSenderId({
          sender: this.sender,
          tenants: [this.sender]
        })
      );
      this.postControl('join', { sender: this.sender });
    }, 1);
  }

  postData(action: BusAction | Action, target?: string): void {
    // @ts-ignore
    if (!action.sender) {
      // Send only non bus-received messages
      this.dataChannel.postMessage({
        ...JSON.parse(JSON.stringify(action)),
        sender: this.sender,
        target
      });
    }
  }

  postControl(type: ControlMessageType, data: any) {
    this.controlChannel.postMessage({ type, data, sender: this.sender });
  }

  manageControlMessage(msg: ControlMessage) {
    switch (msg.type) {
      case 'join':
        this.store.dispatch(DashboardActions.join({ sender: msg.sender }));
        this.relaseBufferedActions(msg.sender);
        break;
      case 'leave':
        this.store.dispatch(DashboardActions.leave({ sender: msg.sender }));
        break;
      default:
        console.error('Message type unrecognized', msg.type);
    }
  }

  bufferUntilJoined(action: Action<any>) {
    // Buffers these actions until a new tab join
    this.buffer.push(action);
  }

  relaseBufferedActions(sender: string) {
    // Release buffered actions waiting for that join
    this.buffer.forEach((action) => {
      this.postData(action, sender);
    });
    this.buffer.length = 0;
  }
}
