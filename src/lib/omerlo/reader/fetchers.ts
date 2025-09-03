import { accountsFetchers } from './endpoints/accounts';
import { categoriesFetchers } from './endpoints/categories';
import { deviceFetchers } from './endpoints/device';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';
import { contentsFetchers } from './endpoints/contents';
import { mediaFetchers } from './endpoints/media';
import { organizationFetchers } from './endpoints/organizations';
import { menuFetchers } from './endpoints/menu';
import { magazineFetchers } from './endpoints/magazines';
import { distributionFetchers } from './endpoints/distributions';
import { eventFetchers } from './endpoints/events';
import { personFetchers } from './endpoints/person';
import { projectFetchers } from './endpoints/projects';
import { webpageFetchers } from './endpoints/webpage';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    ...categoriesFetchers(f),
    ...contentsFetchers(f),
    ...mediaFetchers(f),
    ...menuFetchers(f),
    ...webpageFetchers(f),
    ...organizationFetchers(f),
    ...eventFetchers(f),
    ...personFetchers(f),
    ...projectFetchers(f),
    notifications: notificationFetchers(f),
    magazines: {
      ...magazineFetchers(f),
      ...distributionFetchers(f)
    }
  };
};
