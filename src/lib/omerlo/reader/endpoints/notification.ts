import { request } from '$reader/utils/request';
import { parseMany, type ApiAssocs, type ApiData, type PagingParams } from '$reader/utils/api';

export const notificationFetchers = (f: typeof fetch) => {
  return {
    listTopics: listTopics(f),
    subscribeToTopic: subscribeToTopic(f),
    unsubscribeFromTopic: unsubscribeFromTopic(f),
  };
};

export function listTopics(f: typeof fetch) {
  return (params?: Partial<PagingParams>) => {
    const opts = { queryParams: params, parser: parseMany(parseTopicSummary) };
    return request(f, '/topics', opts);
  };
}

export function parseTopicSummary(data: ApiData, _assocs: ApiAssocs): TopicSummary {
  return {
    id: data.id,
    localized: {
      locale: data.localized.locale,
      name: data.localized.name,
    },
    available_locales: data.available_locales,
    updatedAt: data.updated_at
  };
}

export interface TopicSummary {
  id: string,
  localized: {
    locale: string,
    name: string,
  },
  available_locales: string[],
  updatedAt: Date
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

export function unsubscribeFromTopic(f: typeof fetch) {
  return (params: SubscribtionParams) => {
    const body = { push_token: params.pushToken };
    const opts = { method: 'post', body };
    return request(f, '/topics/${params.topicId}/unsubscribe', opts);
  };
}
