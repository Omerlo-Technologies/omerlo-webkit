import type { EventSummary } from '../endpoints/events';
import type { OrganizationSummary } from '../endpoints/organizations';
import type { PersonSummary } from '../endpoints/person';
import type { ProfileSummary } from '../endpoints/profiles';
import type { ProjectSummary } from '../endpoints/projects';

export function isEvent(profile: ProfileSummary): profile is EventSummary {
  return profile.kind === 'event';
}

export function isOrganization(profile: ProfileSummary): profile is OrganizationSummary {
  return profile.kind === 'organization';
}

export function isPerson(profile: ProfileSummary): profile is PersonSummary {
  return profile.kind === 'person';
}

export function isProject(profile: ProfileSummary): profile is ProjectSummary {
  return profile.kind === 'project';
}
