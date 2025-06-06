import { accountsFetchers } from './endpoints/accounts';
import { categoriesFetchers } from './endpoints/categories';
import { deviceFetchers } from './endpoints/device';
import { notificationFetchers } from './endpoints/notification';
import { oauthFetchers } from './endpoints/oauth';
import { contentsFetchers } from './endpoints/contents';
import { mediaFetchers } from './endpoints/media';
import { issuesFetchers } from './endpoints/issues';
import { organizationFetchers } from './endpoints/organizations';
import { issuesFetchers } from './endpoints/issues';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...deviceFetchers(f),
    ...oauthFetchers(f),
    ...categoriesFetchers(f),
    ...contentsFetchers(f),
    ...mediaFetchers(f),
    ...issuesFetchers(f),
    ...organizationFetchers(f),
    ...issuesFetchers(f),
    notifications: notificationFetchers(f)
  };
};
