import type * as Publisher from '$types/publisher';
import { faker } from '@faker-js/faker';
import { buildImage } from './core';

export function buildAnnouncementSummary(
  attrs: Partial<Publisher.AnnoucementSummary>
): Publisher.AnnoucementSummary {
  const announcementSummary = {
    id: faker.string.uuid(),
    locale: 'en',
    titleText: "My announcement",
    titleHtml: "My announcement",
    subtitleText: "SUBTITLE",
    subtitleHtml: "SUBTITLE",
    visual: buildImage(),
  };

  return {...announcementSummary, ...attrs};
}

export function buildAnnouncement(
  attrs: Partial<Publisher.Annoucement>
): Publisher.Annoucement {
  return {...buildAnnouncementSummary(attrs)};
}
