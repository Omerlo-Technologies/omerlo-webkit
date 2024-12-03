import type { Category, Image, Slideshow, Video } from "$types/core";
import { faker } from "@faker-js/faker";
import { buildList, locales, random } from "./utils";

export function buildCategory(attrs: Partial<Category> = {}): Category {
  const category: Category = {
    id: faker.string.uuid(),
    locale: random(locales),
    name: faker.company.name(),
  }

  return {...category, ...attrs}
}

export function buildImage(attrs: Partial<Image> = {}): Image {
  const image: Image = {
    captionHtml: '<p>Some caption</p>',
    captionText: 'Some caption',
    credit: 'Omerlo',
    gravity: 'north',
    url: 'url',
  };

  return {...image, ...attrs};
}

export function buildSlideshow(attrs: Partial<Slideshow> = {}): Slideshow {
  const image: Slideshow = {
    images: buildList(4, buildImage)
  };

  return {...image, ...attrs};
}

export function buildVideo(attrs: Partial<Video> = {}): Video {
  const image: Video = {
    provider: 'youtube',
    credit: "Omerlo",
    captionHtml: "<p>A nice music</p>",
    captionText: "A nice music",
    video_id: "CFGLoQIhmow",
    isTrackingEnabled: false,
    monetized: false,
    embedUrl: "https://www.youtube.com/embed/CFGLoQIhmow",
    thumbnailUrl: "https://img.youtube.com/vi_webp/CFGLoQIhmow/hqdefault.webp"
  };

  return {...image, ...attrs};
}
