import { defineArrayMember, defineField } from "sanity";

const IMAGE_ASSET_FILTER = 'assetType == "image"';

/**
 * Reference helpers — Room / Homepage / SiteSettings point here
 * instead of uploading the same binary twice.
 */
export function imageAssetReference(
  overrides: {
    name: string;
    title: string;
    description?: string;
    group?: string;
    required?: boolean;
  },
) {
  const { required = false, ...rest } = overrides;
  return defineField({
    ...rest,
    type: "reference",
    to: [{ type: "mediaAsset" }],
    options: {
      filter: IMAGE_ASSET_FILTER,
      disableNew: false,
    },
    validation: required
      ? (Rule) => Rule.required().error("Select an asset from the Media Library")
      : undefined,
  });
}

export function imageAssetReferenceArray(
  overrides: {
    name: string;
    title: string;
    description?: string;
    group?: string;
  },
) {
  return defineField({
    ...overrides,
    type: "array",
    of: [
      defineArrayMember({
        type: "reference",
        to: [{ type: "mediaAsset" }],
        options: {
          filter: IMAGE_ASSET_FILTER,
        },
      }),
    ],
    options: {
      layout: "grid",
    },
  });
}
