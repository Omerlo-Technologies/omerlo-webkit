import { request } from '$reader/utils/request';

export const deviceFetchers = (f: typeof fetch) => {
  return {
    registerDevice: registerDevice(f)
  };
};

export interface DeviceParams {
  pushToken: string,
}

export function registerDevice(f: typeof fetch) {
  return (params: DeviceParams) => {
    const body = { push_token: params.pushToken };
    const opts = { body, method: 'post' };
    return request(f, '/devices/register', opts);
  };
}
