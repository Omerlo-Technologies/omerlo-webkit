import { accountsFetchers } from './endpoints/accounts';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...oauthFetchers(f),
    ...notificationFetchers(f),
  };
};
