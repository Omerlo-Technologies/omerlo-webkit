import { accountsFetchers } from './endpoints/accounts';
import { categoriesFetchers } from './endpoints/categories';
import { deviceFetchers } from './endpoints/device';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';
import { personFetchers } from './endpoints/person';
import { projectFetchers } from './endpoints/projects';
import { eventFetchers } from './endpoints/events';
import { contentsFetchers } from './endpoints/contents';
import { organizationFetchers } from './endpoints/organizations';
import { profileTypeFetchers } from './endpoints/profileType';
import { menuFetchers } from './endpoints/menu';
import { mediaFetchers } from './endpoints/media';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    ...categoriesFetchers(f),
    ...personFetchers(f),
    ...projectFetchers(f),
    ...eventFetchers(f),
    ...contentsFetchers(f),
    ...organizationFetchers(f),
    ...profileTypeFetchers(f),
    ...menuFetchers(f),
    ...mediaFetchers(f),
    notifications: notificationFetchers(f)
  };
};
