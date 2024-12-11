import type * as Composer from '$types/composer';
import { faker } from '@faker-js/faker';
import { buildList, locales, random } from './utils';
import { buildImage, buildVideo } from './core';

export function buildContentSummary(
	attrs: Partial<Composer.ContentSummary> = {}
): Composer.ContentSummary {
	const content: Composer.ContentSummary = {
		id: faker.string.uuid(),
		authors: [],
		templateId: faker.string.uuid(),
		locale: 'en',
		visibility: 'free',
		canonicalDomain: 'omerlo.com',
		canonicalUrl: null,
		categories: [],
		publishedAt: faker.date.past(),
		showPublishedAt: false,
		updatedAt: faker.date.past(),
		titleHtml: 'Title',
		titleText: 'Title',
		subtitleHtml: 'Subtitle',
		subtitleText: 'Subtitle',
		leadHtml: 'Lead',
		leadText: 'Lead',
		seo: buildSeo(),
		visual: buildImage()
	};

	return { ...content, ...attrs };
}

export function buildContent(attrs: Partial<Composer.Content> = {}): Composer.Content {
	const content: Composer.Content = {
		...buildContentSummary(attrs),
		blocks: []
	};

	return { ...content, ...attrs };
}

export function buildContentTemplate(
	attrs: Partial<Composer.ContentTemplate> = {}
): Composer.ContentTemplate {
	const template: Composer.ContentTemplate = {
		id: faker.string.uuid(),
		key: faker.string.uuid(),
		locale: random(locales),
		name: faker.internet.displayName(),
		updatedAt: faker.date.past()
	};

	return { ...template, ...attrs };
}

export function buildSeo(attrs: Partial<Composer.Seo> = {}) {
	const seo: Composer.Seo = {
		title: 'Some seo title',
		description: 'Some seo description'
	};
	return { ...seo, ...attrs };
}

export function buildBlock(
	type: string = 'richtext',
	attrs: Partial<Composer.ContentBlock>
): Composer.ContentBlock {
	switch (type) {
		case 'richtext':
			return buildBlockRichtext(attrs);
		default:
			return buildBlockRichtext(attrs);
	}
}

export function buildBlockRichtext(
	attrs: Partial<Composer.ContentBlockRichtext> = {}
): Composer.ContentBlockRichtext {
	const block: Composer.ContentBlockRichtext = {
		id: faker.string.uuid(),
		contentHtml: '<p> Lorem Ipsum </p>'
	};

	return { ...block, ...attrs };
}

export function buildBlockData(
	attrs: Partial<Composer.ContentBlockData> = {}
): Composer.ContentBlockData {
	const block: Composer.ContentBlockData = {
		id: faker.string.uuid(),
		data: '1,2,3\na,b,c',
		template: 'default',
		contentType: 'csv'
	};

	return { ...block, ...attrs };
}

export function buildBlockHtml(
	attrs: Partial<Composer.ContentBlockHtml> = {}
): Composer.ContentBlockHtml {
	const block: Composer.ContentBlockHtml = {
		id: faker.string.uuid(),
		contentHtml: '<p> Lorem Ipsum </p>'
	};

	return { ...block, ...attrs };
}

export function buildBlockQuote(
	attrs: Partial<Composer.ContentBlockQuote> = {}
): Composer.ContentBlockQuote {
	const block: Composer.ContentBlockQuote = {
		id: faker.string.uuid(),
		author: 'Omerlo',
		quoteHtml: '<p>This is the quote</p>',
		quoteText: 'This is the quote'
	};

	return { ...block, ...attrs };
}

export function buildBlockRelatedComposer(
	attrs: Partial<Composer.ContentBlockRelatedContent> = {}
): Composer.ContentBlockRelatedContent {
	const block: Composer.ContentBlockRelatedContent = {
		id: faker.string.uuid(),
		contents: buildList(4, buildContentSummary)
	};

	return { ...block, ...attrs };
}

export function buildBlockImage(
	attrs: Partial<Composer.ContentBlockImage> = {}
): Composer.ContentBlockImage {
	const block: Composer.ContentBlockImage = {
		id: faker.string.uuid(),
		image: buildImage()
	};

	return { ...block, ...attrs };
}

export function buildBlockSlideshow(
	attrs: Partial<Composer.ContentBlockSlideshow> = {}
): Composer.ContentBlockSlideshow {
	const block: Composer.ContentBlockSlideshow = {
		id: faker.string.uuid(),
		images: buildList(4, buildImage)
	};

	return { ...block, ...attrs };
}

export function buildBlockVideo(
	attrs: Partial<Composer.ContentBlockVideo> = {}
): Composer.ContentBlockVideo {
	const block: Composer.ContentBlockVideo = {
		id: faker.string.uuid(),
		video: buildVideo()
	};

	return { ...block, ...attrs };
}

//
// COMMUNITY
//

export function buildProfileTypeSummary(
	attrs: Partial<Composer.ProfileTypeSummary> = {}
): Composer.ProfileTypeSummary {
	const profileType: Composer.ProfileTypeSummary = {
		id: faker.string.uuid(),
		kind: 'person',
		name: 'Default',
		locale: 'en',
		updatedAt: faker.date.past()
	};

	return { ...profileType, ...attrs };
}

export function buildProfileType(attrs: Partial<Composer.ProfileType> = {}): Composer.ProfileType {
	const profileType: Composer.ProfileType = {
		...buildProfileTypeSummary(attrs),
		hasPhone: true,
		hasEmail: true,
		hasLinkedin: true,
		hasWebsite: true,
		hasFacebook: true,
		hasTwitter: true,
		hasCountry: true,
		hasState: true,
		hasCity: true,
		hasStreet: true
	};

	return { ...profileType, ...attrs };
}

export function buildProfileAddress(
	attrs: Partial<Composer.ProfileAddress> = {}
): Composer.ProfileAddress {
	const address: Composer.ProfileAddress = {
		locale: 'en',
		country: 'Canada',
		state: 'Quebec',
		city: 'Montreal',
		street: '1st Avenue',
		location: 'Apt 56'
	};

	return { ...address, ...attrs };
}

export function buildProfileContact(
	attrs: Partial<Composer.ProfileContact> = {}
): Composer.ProfileContact {
	const contact: Composer.ProfileContact = {
		locale: 'en',
		phone: '(599) 345-6789',
		email: 'not-an-email@omerlo.com',
		linkedin: 'https://www.linkedin.com/company/omerlo/posts/?feedView=all',
		website: 'https://omerlo.com',
		twitter: 'https://x.com/omerlo',
		facebook: 'https://facebook.com/omerlo'
	};

	return { ...contact, ...attrs };
}

export function buildPersonSummary(
	attrs: Partial<Composer.PersonSummary> = {}
): Composer.PersonSummary {
	const person: Composer.PersonSummary = {
		id: faker.string.uuid(),
		profileType: buildProfileType({ kind: 'person' }),
		updatedAt: faker.date.past(),
		firstName: 'Alexandre',
		lastName: 'Lepretre',
		otherName: null,
		pronoun: null,
		logoImageUrl: null,
		coverImageUrl: null,
		locale: 'en',
		descriptionHtml: '<p>Some description</p>',
		descriptionText: 'Some description',
		summaryHtml: '<p>CTO @ Omerlo</p>',
		summaryText: 'CTO @ Omerlo'
	};

	return { ...person, ...attrs };
}

export function buildPerson(attrs: Partial<Composer.Person> = {}): Composer.Person {
	const person: Composer.Person = {
		...buildPersonSummary(attrs),
		address: buildProfileAddress(),
		contact: buildProfileContact()
	};

	return { ...person, ...attrs };
}

export function buildProjectSummary(
	attrs: Partial<Composer.ProjectSummary> = {}
): Composer.ProjectSummary {
	const project: Composer.ProjectSummary = {
		id: faker.string.uuid(),
		profileType: buildProfileType({ kind: 'project' }),
		updatedAt: faker.date.past(),
		name: 'Some project',
		logoImageUrl: null,
		coverImageUrl: null,
		locale: 'en',
		descriptionHtml: '<p>Some description</p>',
		descriptionText: 'Some description',
		summaryHtml: '<p>A cool project</p>',
		summaryText: 'A cool project'
	};

	return { ...project, ...attrs };
}

export function buildProject(attrs: Partial<Composer.Project> = {}): Composer.Project {
	const project: Composer.Project = {
		...buildProjectSummary(attrs),
		address: buildProfileAddress(),
		contact: buildProfileContact()
	};

	return { ...project, ...attrs };
}

export function buildOrganizationSummary(
	attrs: Partial<Composer.OrganizationSummary> = {}
): Composer.OrganizationSummary {
	const organization: Composer.OrganizationSummary = {
		id: faker.string.uuid(),
		profileType: buildProfileType({ kind: 'organization' }),
		updatedAt: faker.date.past(),
		name: faker.company.name(),
		logoImageUrl: null,
		coverImageUrl: null,
		locale: 'en',
		descriptionHtml: '<p>Some description</p>',
		descriptionText: 'Some description',
		summaryHtml: '<p>Omerlo rocks</p>',
		summaryText: 'Omerlo rocks'
	};

	return { ...organization, ...attrs };
}

export function buildOrganization(
	attrs: Partial<Composer.Organization> = {}
): Composer.Organization {
	const organization: Composer.Organization = {
		...buildOrganizationSummary(attrs),
		address: buildProfileAddress(),
		contact: buildProfileContact()
	};

	return { ...organization, ...attrs };
}

export function buildEventSummary(
	attrs: Partial<Composer.EventSummary> = {}
): Composer.EventSummary {
	const event: Composer.EventSummary = {
		id: faker.string.uuid(),
		profileType: buildProfileType({ kind: 'event' }),
		updatedAt: faker.date.past(),
		name: faker.company.name(),
		logoImageUrl: null,
		coverImageUrl: null,
		locale: 'en',
		descriptionHtml: '<p>Some description</p>',
		descriptionText: 'Some description',
		summaryHtml: '<p>Omerlo rocks</p>',
		summaryText: 'Omerlo rocks',
		startsAt: new Date('01-01-2024 10:00:00Z'),
		endsAt: new Date('01-01-2024 11:00:00Z'),
		isAllDay: false,
		subscriptionUrl: null
	};

	return { ...event, ...attrs };
}

export function buildEvent(attrs: Partial<Composer.Event> = {}): Composer.Event {
	const event: Composer.Event = {
		...buildEventSummary(attrs),
		address: buildProfileAddress(),
		contact: buildProfileContact()
	};

	return { ...event, ...attrs };
}
