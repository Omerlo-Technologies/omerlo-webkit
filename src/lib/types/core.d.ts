export interface ApiResponse<T> {
  data: T,
  meta: ApiResponseMeta,
}

export interface ApiResponseMeta {
  next: string | null
}

export interface Category {
  id: string,
  name: string,
  locale: string,
  svg_icon: string | null
}

export type Gravity = 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' | 'center'

export interface Image {
  type: 'image',
  captionHtml: string | null,
  captionText: string | null,
  credit: string | null,
  gravity: Gravity,
  url: string,
}

export interface Slideshow {
  type: 'slideshow',
  images: Image[],
}

export interface Video {
  type: 'video',
  videoId: string,
  credit: string | null,
  captionHtml: string | null,
  captionText: string | null,
  monetized: boolean,
  provider: 'vimeo' | 'youtube' | 'jw',
  embedUrl: string,
  thumbnailUrl: string,
  isTrackingEnabled: boolean
}

export type Visual = Image | Slideshow | Video

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiData = any
/* eslint-enable @typescript-eslint/no-explicit-any */
