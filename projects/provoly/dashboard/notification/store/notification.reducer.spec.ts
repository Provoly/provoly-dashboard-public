import { NotificationActions } from '@provoly/dashboard/notification';
import { initialNotificationState, notificationReducer, NotificationState } from './notification.reducer';

describe('Notification Reducer', () => {
  const initialState: NotificationState = Object.assign({}, initialNotificationState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = notificationReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('an add action', () => {
    it('should deduplicate', () => {
      const firstStep = notificationReducer(
        notificationReducer(
          initialState,
          NotificationActions.add({ notification: { id: 'a', text: { code: 'b' }, creationDate: 'date' } })
        ),
        NotificationActions.add({ notification: { id: 'c', text: { code: 'd' }, creationDate: 'date' } })
      );
      const secondStep = notificationReducer(
        notificationReducer(
          initialState,
          NotificationActions.add({ notification: { id: 'a', text: { code: 'b' }, creationDate: 'date' } })
        ),
        NotificationActions.add({ notification: { id: 'c', text: { code: 'd' }, creationDate: 'date' } })
      );

      expect(firstStep).toEqual(secondStep);
      expect(secondStep).toEqual({
        list: [
          { id: 'a', text: { code: 'b' }, creationDate: 'date' },
          { id: 'c', text: { code: 'd' }, creationDate: 'date' }
        ]
      });
    });
  });
});
