import { request } from '$reader/utils/request';

export const notificationFetchers = (f: typeof fetch) => {
  return {
    registerDevice: registerDevice(f),
    subscribeToTopic: subscribeToTopic(f),
  };
};

export interface DeviceParams {
  pushToken: string,
  name: string,
}

export function registerDevice(f: typeof fetch) {
  return (params: DeviceParams) => {
    const body = { push_token: params.pushToken, name: params.name };
    const opts = { body, method: 'post' };
    return request(f, '/devices/register', opts);
  };
}

export interface SubscribtionParams {
  topicId: string;
  pushToken: string;
}

export function subscribeToTopic(f: typeof fetch) {
  return (params: SubscribtionParams) => {
    const body = { push_token: params.pushToken };
    const opts = { method: 'post', body };
    return request(f, '/topics/${params.topicId}/subscribe', opts);
  };
}
