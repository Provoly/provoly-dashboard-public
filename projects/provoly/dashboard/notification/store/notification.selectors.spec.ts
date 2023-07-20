import { notificationFeatureKey } from '@provoly/dashboard';
import { initialNotificationState } from './notification.reducer';
import { NotificationSelectors } from './notification.selectors';

describe('Notification Selectors', () => {
  const initialState = { ...initialNotificationState };
  it('should select the feature state', () => {
    const result = NotificationSelectors.feature({
      [notificationFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
