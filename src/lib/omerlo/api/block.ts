import type { ContentSummary } from "$types/composer";
import type { ApiData } from "$types/core";
import type { Block } from "$types/publisher";
import { OMERLO_PATH } from ".";
import { omerloFetch } from "..";
import { getAssocs, type ApiAssocs } from "../assocs";
import { parseVisual } from "./visual";

export function blockFetcher(f: typeof fetch) {
  return (id: string) => {
    const opts = { parser: blockParser };
    return omerloFetch(f, `${OMERLO_PATH}/blocks/${id}`, opts);
  };
}

export function blockParser(data: ApiData, assocs: ApiAssocs): Block {
  return {
    id: data.id,
    backgroundColor: data.background_color,
    textColor: data.text_color,
    configurationKey: data.configuration_key,
    type: data.block_type,
    entries: data.entries.map((entries: ApiData) => {
      const result: any = {};

      if (entries.content_ids) {
        result.contents = getAssocs<ContentSummary>(assocs, 'contents', entries.content_ids);
      }

      return result;
    }),
    backgroundSVG: data.background_svg,
    name: data.localized.name,
    description: data.localized.description,
    locale: data.localized.locale,
    html: data.localized.html,
    visual: parseVisual(data.localized.visual)
  };
}
