import { accountsFetchers } from './endpoints/accounts';
import { deviceFetchers } from './endpoints/device';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    notifications: notificationFetchers(f),
  };
};
