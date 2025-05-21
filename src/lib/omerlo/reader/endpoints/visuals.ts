export type Visual = Image | Slideshow | Video

export type Image = {
  type: 'image'
  url: string;
  captionHtml: string;
  captionText: string;
  credit: string;
  gravity: Gravity
}

export type Slideshow = {
  type: 'slideshow';
}

export type Video = {
  type: 'video';
}

export type Gravity =
  'center' |
  'north' |
  'northeast' |
  'east' |
  'southeast' |
  'south' |
  'southwest' |
  'west' |
  'northwest';

