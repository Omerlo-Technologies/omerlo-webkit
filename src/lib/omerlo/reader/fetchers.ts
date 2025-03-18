import { accountsFetchers } from './endpoints/accounts';
import { oauthFetchers } from './endpoints/oauth';

export const fetchers = (f: typeof fetch) => {
  return {
    ...accountsFetchers(f),
    ...oauthFetchers(f),
  };
};
