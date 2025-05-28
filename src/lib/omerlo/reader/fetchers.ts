import { accountsFetchers } from './endpoints/accounts';
import { categoriesFetchers } from './endpoints/categories';
import { deviceFetchers } from './endpoints/device';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';
import { projectFetchers } from './endpoints/projects';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    ...categoriesFetchers(f),
    ...projectFetchers(f),
    notifications: notificationFetchers(f)
  };
};
