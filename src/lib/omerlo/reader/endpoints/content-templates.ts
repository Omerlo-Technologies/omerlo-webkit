import type { LocalesMetadata } from "$reader/utils/response";

export interface ContentTemplate {
  id: string;
  key: string;
  name: string;
  meta: {
    locales: LocalesMetadata;
  };
  metadata: Record<string, string>;
  enableFields: string[];
  updatedAt: Date;
}

export interface ContentBlockTemplate {
  id: string;
  key: string;
}
