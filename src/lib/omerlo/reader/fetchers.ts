import { accountsFetchers } from './endpoints/accounts';
import { categoriesFetchers } from './endpoints/categories';
import { deviceFetchers } from './endpoints/device';
import { mediaBlockFetchers } from './endpoints/media-block';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';
import { personFetchers } from './endpoints/person';
import { projectFetchers } from './endpoints/projects';
import { eventFetchers } from './endpoints/events';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    ...categoriesFetchers(f),
    ...personFetchers(f),
    ...projectFetchers(f),
    ...eventFetchers(f),
    ...mediaBlockFetchers(f),
    notifications: notificationFetchers(f)
  };
};
