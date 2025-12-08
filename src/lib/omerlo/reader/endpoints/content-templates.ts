import { parseLocalesMetadata, type LocalesMetadata } from '$reader/utils/response';
import type { ApiAssocs, ApiData } from '$reader/utils/api';
import { buildMeta } from '$reader/utils/parseHelpers';
import type { Metadata } from '$reader/parsers/common-parser';

export interface ContentTemplate {
  id: string;
  key: string;
  name: string;
  meta: {
    locales: LocalesMetadata;
  };
  metadata: Metadata;
  enabledFields: string[];
  updatedAt: Date;
}

export interface ContentBlockTemplate {
  id: string;
  key: string;
  visual: {
    allowedTypes: string[];
    isEnabled: boolean;
  };
}

export function parseContentBlockTemplate(data: ApiData, _assocs: ApiAssocs): ContentBlockTemplate {
  return {
    id: data.id,
    key: data.key,
    visual: {
      allowedTypes: data.visual.allowed_types,
      isEnabled: data.visual.is_enabled
    }
  };
}

export function parseContentTemplate(data: ApiData, _assocs: ApiAssocs): ContentTemplate {
  let name: string;
  let meta: { locales: LocalesMetadata };

  if (data.localized !== undefined) {
    // NOTE: this is for retrocompatibility with public publisher api v2
    name = data.localized?.name || null;
    meta = buildMeta(data.localized?.locale || null);
  } else {
    name = data.name;
    meta = { locales: parseLocalesMetadata(data.meta) };
  }

  return {
    id: data.id,
    key: data.key,
    name,
    meta,
    metadata: data.metadata,
    enabledFields: data.enabled_fields,
    updatedAt: data.updated_at
  };
}
