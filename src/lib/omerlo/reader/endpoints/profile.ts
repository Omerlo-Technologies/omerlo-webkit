import { parsePersonSummary, type PersonSummary } from './person';
import  { parseProjectSummary, type ProjectSummary } from './projects';
import { parseOrganizationSummary, type OrganizationSummary } from './organizations';
import { parseEventSummary, type EventSummary } from './events';
import type { ApiAssocs, ApiData } from "../utils/api";


export type Profile = PersonSummary | ProjectSummary | OrganizationSummary | EventSummary;
type ProfileKind = 'person' | 'project' | 'organization' | 'event';

const profileParser: Record<ProfileKind, (data: ApiData, _assocs: ApiAssocs) => Profile> = {
  person: parsePersonSummary,
  project: parseProjectSummary,
  organization: parseOrganizationSummary,
  event: parseEventSummary
}
export function parseProfile(data: ApiData, assocs: ApiAssocs): Profile | null {
  const parser = profileParser[data.kind as string as ProfileKind];
  return parser ? parser(data, assocs) : null;
}

// getProfile function?
// listProfiles function?

