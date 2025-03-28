import { accountsFetchers } from './endpoints/accounts';
import { deviceFetchers } from './endpoints/device';
import { oauthFetchers } from './endpoints/oauth';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...oauthFetchers(f),
    ...deviceFetchers(f),
  };
};
