import type { ApiAssocs, ApiData } from "../utils/api";

export type Visual = Image | Slideshow | Video;

export interface Video {
  type: string;
  url: string;
  captionHtml: string | null;
  captionText: string | null;
  credit: string | null;
  videoID: string,
  monetized: boolean;
  provider: string;
  source?: string;
  embedURL: string;
  thumbnailURL: string;
  isTrackingEnabled: boolean;
}

export interface Slideshow {
  type: string;
  images: Image[];
};

export interface Image {
  type: string;
  url: string;
  captionHtml: string | null;
  captionText: string | null;
  credit: string;
  gravity: Gravity;
};

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
    video: parseVideo,
  };

  export function parseVisual(data: ApiData, _assocs: ApiAssocs): Visual | null {
    const parser = VisualParser[data.type as VisualType];
    return parser ? parser(data, _assocs) : null;
  }

  export function parseImage(data: ApiData, _assocs: ApiAssocs) : Image {
    return {
      type: 'image',
      url: data.url,
      captionHtml: data.caption_html,
      captionText: data.caption_text,
      credit: data.credit,
      gravity: data.gravity
    };
  }
export function parseSlideshow(data: ApiData, _assocs: ApiAssocs): Slideshow {
  return {
    type: 'slideshow',
    images: Array.isArray(data.images) 
      ? data.images.map((imageData: ApiData) => parseImage(imageData, _assocs))
      : [],
  };
}
export function parseVideo(data: ApiData, _assocs: ApiAssocs): Video {
  return {
    type: 'video',
    videoID: data.video_id,
    monetized: data.monetized,
    provider: data.provider,
    embedURL: data.embed_url,
    thumbnailURL: data.thumbnail_url,
    url: data.url,
    captionHtml: data.caption_html,
    credit: data.credit,
    captionText: data.caption_text,
    isTrackingEnabled: data.is_tracking_enabled,
  };
}
