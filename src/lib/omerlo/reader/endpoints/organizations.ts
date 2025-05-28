import type { ApiAssocs } from "../utils/api";
import { type ApiData, parseMany, type PagingParams } from "../utils/api";
import { getAssocs } from "../utils/assocs";
import { requestPublisher } from "../utils/request";
import type { LocalesMetadata } from "../utils/response";
import type { Category } from "./categories";
import { parseProfileAddress, type ProfileAddress } from "./profiles";

export const organizationFetchers = (f: typeof fetch) => {
  return {
    listOrganizations: listOrganizations(f),
    getOrganization: getOrganization(f)
  };
};

export interface OrganizationSummary {
    id: string;
    // profileType: ProfileType;
    kind: string;
    name: string;
    logoImgURL: string | null;
    meta: {
        locales: LocalesMetadata;
    };
    summaryHtml: string | null;
    summaryText: string | null;
    updatedAt: Date;
}

export interface Organization extends OrganizationSummary {
    coverImgURL: string | null;
    categories: Category[];
    contact: unknown; // ProfileContact | null;
    address: ProfileAddress | null;
    description: unknown; // ProfileDescription | null;
}

export function parseOrganizationSummary(data: ApiData, _assocs: ApiAssocs): OrganizationSummary {
  return {
        id: data.id,
        // profileType: getAssocs<ProfileType>(_assocs, 'profileTypes', data.profile_type_id),
        kind: 'organization',
        name: data.name,
        logoImgURL: data.logo_image_url,
        meta: {
            locales: {
                available: [data.localized.locale],
                current: data.localized.locale
            }
        },
        summaryHtml: data.localized.summary_html,
        summaryText: data.localized.summary_text,
        updatedAt: new Date(data.updated_at)
    };
}

export function parseOrganization(data: ApiData, assocs: ApiAssocs): Organization {
  // const contact = data.localized.contact
  //   ? parseProfileContact(data.localized.contact, assocs)
  //   : null;
  const address = data.localized_address
    ? parseProfileAddress(data.localized_address, assocs)
    : null;
  // const description = data.localized.description
  //   ? parseProfileDescription(data.localized.description, assocs)
  //   : null;

  return {
        ...parseOrganizationSummary(data, assocs),
        coverImgURL: data.cover_image_url,
        categories: getAssocs<Category>(assocs, 'categories', data.category_ids),
        contact: null,
        address,
        description: null
    };
}

export function getOrganization(f: typeof fetch) {
  return async (id: string) => {
    const opts = { parser: parseOrganization };
    return requestPublisher(f, `/organizations/${id}`, opts);
  };
}

export function listOrganizations(f: typeof fetch) {
  return async (params?: Partial<PagingParams>) => {
    const opts = { parser: parseMany(parseOrganizationSummary), queryParams: params };
    return requestPublisher(f, `/organizations`, opts);
  };
}
