import type { ApiAssocs, ApiData } from '$reader/utils/api';

export type Visual = Image | Slideshow | Video;

export interface Video {
  type: 'video';
  url: string;
  captionHtml: string | null;
  captionText: string | null;
  credit: string | null;
  videoID: string;
  monetized: boolean;
  provider: string;
  source?: string;
  embedUrl: string;
  thumbnailUrl: string;
  isTrackingEnabled: boolean;
}

export interface Slideshow {
  type: 'slideshow';
  images: Image[];
}

export interface Image {
  type: 'image';
  url: string;
  captionHtml: string | null;
  captionText: string | null;
  credit: string;
  gravity: Gravity;
}

export type Gravity =
  | 'center'
  | 'north'
  | 'northeast'
  | 'east'
  | 'southeast'
  | 'south'
  | 'southwest'
  | 'west'
  | 'northwest';

export type VisualType = 'image' | 'slideshow' | 'video';

const VisualParser: Record<VisualType, (data: ApiData, _assocs: ApiAssocs) => Visual> = {
  image: parseImage,
  slideshow: parseSlideshow,
  video: parseVideo
};

export function parseVisual(data: ApiData, assocs: ApiAssocs): Visual | null {
  const type = data?.type as VisualType;
  if (!type) return null;
  return VisualParser[type]?.(data, assocs) ?? null;
}

export function parseImage(data: ApiData, _assocs: ApiAssocs): Image {
  return {
    type: 'image',
    url: data.url,
    captionHtml: data.caption_html,
    captionText: data.caption_text,
    credit: data.credit,
    gravity: data.gravity
  };
}

export function parseSlideshow(data: ApiData, assocs: ApiAssocs): Slideshow {
  return {
    type: 'slideshow',
    images: Array.isArray(data.images)
      ? data.images.map((imageData: ApiData) => parseImage(imageData, assocs))
      : []
  };
}

export function parseVideo(data: ApiData, _assocs: ApiAssocs): Video {
  return {
    type: 'video',
    videoID: data.video_id,
    monetized: data.monetized,
    provider: data.provider,
    embedUrl: data.embed_url,
    thumbnailUrl: data.thumbnail_url,
    url: data.url,
    captionHtml: data.caption_html,
    credit: data.credit,
    captionText: data.caption_text,
    isTrackingEnabled: data.is_tracking_enabled
  };
}

export type Metadata = Record<string, string>
