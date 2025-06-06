import { parseCategory } from './endpoints/categories';
import { parseProfileBlock, parseProfileSummary } from './endpoints/profiles';
import { parseContentBlockTemplate, parseContentTemplate } from './endpoints/content-templates';
import { parseProfileTypeSummary } from './endpoints/profileType';
import { registerAssocParser } from './utils/assocs';
import { parseContentSummary } from './endpoints/contents';

export * from './stores/user_session';
export type * from './endpoints/oauth';
export type * from './endpoints/accounts';

registerAssocParser('categories', parseCategory);
registerAssocParser('profiles', parseProfileSummary);
registerAssocParser('templates', parseContentTemplate);
registerAssocParser('profile_types', parseProfileTypeSummary);
registerAssocParser('profile_block_types', parseProfileBlock);
registerAssocParser('block_templates', parseContentBlockTemplate);
registerAssocParser('contents', parseContentSummary);
