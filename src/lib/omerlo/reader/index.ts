import { parseCategory } from './endpoints/categories';
import { parseProfileBlock, parseProfileSummary } from './endpoints/profiles';
import { parseContentBlockTemplate, parseContentTemplate } from './endpoints/content-templates';
import { parseProfileTypeSummary } from './endpoints/profileType';
import { registerAssocParser } from './utils/assocs';
import { parseContentSummary } from './endpoints/contents';
import { parseIssueBlockConfiguration, parseIssueType } from './endpoints/magazines';

export * from './stores/user_session';
export type * from './endpoints/oauth';
export type * from './endpoints/accounts';

registerAssocParser('categories', parseCategory);
registerAssocParser('profiles', parseProfileSummary);
registerAssocParser('content_templates', parseContentTemplate);
registerAssocParser('profile_types', parseProfileTypeSummary);
registerAssocParser('profile_block_types', parseProfileBlock);
registerAssocParser('content_block_templates', parseContentBlockTemplate);
registerAssocParser('contents', parseContentSummary);
registerAssocParser('issue_types', parseIssueType);
registerAssocParser('issue_block_configurations', parseIssueBlockConfiguration);

// NOTE: This one is for retro compatibility with publisher public api v2
registerAssocParser('templates', parseContentTemplate);
