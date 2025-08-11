import * as Reader from '$reader/fetchers';
import { initReader } from './reader';

initReader();

export const useReader = Reader.fetchers;
