import type { ApiData } from '$reader/utils/api';
import { requestPublisher } from '$reader/utils/request';
import { parseDate } from '$reader/utils/parseHelpers';
// import Issue from './issue';

export const releaseFetchers = (f: typeof fetch) => {
  return {
    getRelease: getRelease(f),
  };
};

export interface Release {
  id: string;
  issueID: string;
  isPublished: boolean;
  startsAt: Date;
  endsAt: Date | null;
//issue: Issue
}

export function parseRelease(data: ApiData): Release {
  return {
    id: data.id,
    issueID: data.issue_id,
    isPublished: data.is_published,
    startsAt: new Date(data.starts_at),
    endsAt: parseDate(data.ends_at)
    //issue: parseIssue(data.issue),
  };
}

export function getRelease(f: typeof fetch) {
  return async () => {
    const opts = { parser: parseRelease };
    return requestPublisher(f, `release/`, opts);
  };
}
