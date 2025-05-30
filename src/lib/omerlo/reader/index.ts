import { parseCategory } from './endpoints/categories';
import { parseProfileSummary } from './endpoints/profiles';
import { parseContentTemplate } from './endpoints/content-templates';
import { parseProfileTypeSummary } from './endpoints/profileType';
import { registerAssocParser } from './utils/assocs';

export * from './stores/user_session';
export type * from './endpoints/oauth';
export type * from './endpoints/accounts';

registerAssocParser('categories', parseCategory);
registerAssocParser('profiles', parseProfileSummary);
registerAssocParser('templates', parseContentTemplate);
registerAssocParser('profile_types', parseProfileTypeSummary);
