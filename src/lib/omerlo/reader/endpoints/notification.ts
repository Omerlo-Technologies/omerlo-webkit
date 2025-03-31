import { request } from '$reader/utils/request';

export const notificationFetchers = (f: typeof fetch) => {
  return {
    subscribeToTopic: subscribeToTopic(f),
    unsubscribeFromTopic: unsubscribeFromTopic(f),
  };
};

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

export function unsubscribeFromTopic(f: typeof fetch) {
  return (params: SubscribtionParams) => {
    const body = { push_token: params.pushToken };
    const opts = { method: 'post', body };
    return request(f, '/topics/${params.topicId}/unsubscribe', opts);
  };
}
