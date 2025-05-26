import { accountsFetchers } from './endpoints/accounts';
import { categoriesFetchers } from './endpoints/categories';
import { deviceFetchers } from './endpoints/device';
import { mediaBlockFetchers } from './endpoints/media-block';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    ...categoriesFetchers(f),
    ...mediaBlockFetchers(f),
    notifications: notificationFetchers(f)
  };
};
