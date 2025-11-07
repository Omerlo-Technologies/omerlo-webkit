import { parseCategory } from './endpoints/categories';
import { parseProfileBlockTypeSummary, parseProfileSummary } from './endpoints/profiles';
import { parseContentBlockTemplate, parseContentTemplate } from './endpoints/content-templates';
import { parseProfileTypeSummary } from './endpoints/profileType';
import { registerAssocParser } from './utils/assocs';
import { parseContentSummary } from './endpoints/contents';

import {
  parseIssueBlockConfiguration,
  parseIssueSummary,
  parseIssueType
} from './endpoints/magazines';

import { parseMediaBlockConfiguration } from './endpoints/media';

export * from './stores/user_session';
export type * from './endpoints/accounts';
export type * from './endpoints/categories';
export type * from './endpoints/content-templates';
export type * from './endpoints/contents';
export type * from './endpoints/device';
export type * from './endpoints/distributions';
export type * from './endpoints/events';
export type * from './endpoints/magazines';
export type * from './endpoints/media';
export type * from './endpoints/menu';
export type * from './endpoints/notification';
export type * from './endpoints/oauth';
export type * from './endpoints/organizations';
export type * from './endpoints/person';
export type * from './endpoints/profileType';
export type * from './endpoints/profiles';
export type * from './endpoints/projects';
export type * from './endpoints/visuals';
export type * from './endpoints/webpage';
export type * from './utils/response';

// TODO: This should all be summary parsers!
export function initReader() {
  registerAssocParser('categories', parseCategory);
  registerAssocParser('profiles', parseProfileSummary);
  registerAssocParser('content_templates', parseContentTemplate);
  registerAssocParser('profile_types', parseProfileTypeSummary);
  registerAssocParser('profile_block_types', parseProfileBlockTypeSummary);
  registerAssocParser('content_block_templates', parseContentBlockTemplate);
  registerAssocParser('contents', parseContentSummary);
  registerAssocParser('issues', parseIssueSummary);
  registerAssocParser('issue_types', parseIssueType);
  registerAssocParser('issue_block_configurations', parseIssueBlockConfiguration);
  registerAssocParser('media_block_configurations', parseMediaBlockConfiguration);

  // NOTE: Those ones are for retro compatibility with publisher public api v2
  // Reason is we renamed some assocs keys in Reader API that are different
  // from Publisher public API V2
  registerAssocParser('templates', parseContentTemplate);
  registerAssocParser('block_templates', parseContentBlockTemplate);
}
