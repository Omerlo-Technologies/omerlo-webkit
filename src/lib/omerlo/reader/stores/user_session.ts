import { getContext, setContext } from 'svelte';
import type { UserInfo } from '../endpoints/accounts';
import { writable, type Readable } from 'svelte/store';
import { browser } from '$app/environment';
import { useReader } from '$omerlo';
import { invalidate } from '$app/navigation';

export interface UserSession {
  user: UserInfo | null;
  verified: boolean;
  authenticated: boolean;
}

const anonymousUserSession: UserSession = {
  user: null,
  verified: false,
  authenticated: false
};

export function initUserSession(session: UserSession): ReadableUserSession {
  const { subscribe, update, set } = writable<UserSession>(session);

  if (browser) {
    localStorage.setItem('user_session', JSON.stringify(session));

    addEventListener('storage', (event) => {
      if (event.key != 'user_session') return;

      if (!event.newValue) {
        set(anonymousUserSession);
      } else {
        const userSession: UserSession = JSON.parse(event.newValue);
        set(userSession);
      }
    });
  }

  const ctx = {
    subscribe,
    handleLogout: () => {
      if (!browser) {
        throw new Error('MUST NOT call refresh on user session from server side.');
      }

      invalidate('omerlo:user_session');

      update(updateUserInfo(null, false, false));
    },
    refresh: async () => {
      if (!browser) {
        throw new Error('MUST NOT call refresh on user session from server side.');
      }

      const userInfo = await useReader(fetch).userInfo();
      update(updateUserInfo(userInfo.data, true, userInfo.ok));
    }
  };

  setContext('user_session', ctx);
  return ctx;
}

const updateUserInfo = (userInfo: UserInfo | null, authenticated: boolean, verified: boolean) => {
  return (session: UserSession) => {
    session.user = userInfo;
    session.verified = verified;
    session.authenticated = authenticated;
    localStorage.setItem('user_session', JSON.stringify(session));
    return session;
  };
};

interface ReadableUserSession extends Readable<UserSession> {
  refresh: () => void;
  handleLogout: () => void;
}

export function getUserSession(): ReadableUserSession {
  return getContext('user_session');
}
