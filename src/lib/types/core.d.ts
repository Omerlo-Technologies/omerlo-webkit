export interface ApiResponse<T> {
  entries: T,
  meta: ApiResponseMeta,
  assocs: []
}

export interface ApiResponseMeta {
  next: string | null
}

export interface Category {
  id: string,
  name: string,
  locale: string,
  svg_icon: string
}

export type Gravity = 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest' | 'center'

export interface Image {
  caption_html: string,
  caption_text: string,
  credit: string,
  gravity: Gravity,
  url: string,
}

export interface Slideshow {
  images: Image[],
}

export interface Video {
  video_id: string,
  credit: string,
  captionHtml: string,
  captionText: string,
  monetized: boolean,
  provider: 'vimeo' | 'youtube' | 'jw',
  embedUrl: string,
  thumbnailUrl: string
}

export type Visual = Image | Slideshow | Video

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ApiData = any
/* eslint-enable @typescript-eslint/no-explicit-any */
