import type { Visual, Image, Video, Slideshow, ApiData } from '$types/core';

export function parseVisual(data: ApiData): Visual | null {
  switch (data?.type) {
    case 'image':
      return parseImage(data);
    case 'slideshow':
      return parseSlideshow(data);
    case 'video':
      return parseVideo(data);
    default:
      return null;
  }
}

export function parseImage(data: ApiData): Image {
  return {
    type: 'image',
    captionHtml: data.caption_html,
    captionText: data.caption_text,
    credit: data.credit,
    gravity: data.gravity,
    url: data.url,
  }
}

export function parseVideo(data: ApiData): Video {
  return {
    type: 'video',
    videoId: data.video_id,
    credit: data.credit,
    captionHtml: data.caption_html,
    captionText: data.caption_text,
    monetized: data.monetized,
    provider: data.provider,
    embedUrl: data.embed_url,
    thumbnailUrl: data.thumbnail_url,
    isTrackingEnabled: data.is_tracking_enabled,
  }
}

export function parseSlideshow(data: ApiData): Slideshow {
  return {
    type: 'slideshow',
    images: data.images.map(parseImage),
  }
}
