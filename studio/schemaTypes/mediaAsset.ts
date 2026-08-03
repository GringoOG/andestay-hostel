import { defineArrayMember, defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "Room", value: "room" },
  { title: "Hostel", value: "hostel" },
  { title: "Restaurant", value: "restaurant" },
  { title: "Garden", value: "garden" },
  { title: "Homepage", value: "homepage" },
  { title: "Tour", value: "tour" },
  { title: "Logo", value: "logo" },
  { title: "SEO", value: "seo" },
] as const;

const ASSET_TYPES = [
  { title: "Image", value: "image" },
  { title: "Video", value: "video" },
  { title: "PDF", value: "pdf" },
] as const;

/**
 * MediaAsset — shared Asset Library for Room, Homepage, SiteSettings, Tours…
 * Upload once; reference everywhere (no duplicate binaries).
 */
export const mediaAsset = defineType({
  name: "mediaAsset",
  title: "Media asset",
  type: "document",
  orderings: [
    {
      title: "Category + order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
  groups: [
    { name: "asset", title: "Asset", default: true },
    { name: "meta", title: "Metadata" },
    { name: "org", title: "Organization" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "asset",
      validation: (Rule) => Rule.required().min(2).max(160),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "asset",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "assetType",
      title: "Asset type",
      type: "string",
      group: "asset",
      options: {
        list: [...ASSET_TYPES],
        layout: "radio",
      },
      initialValue: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "asset",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.assetType !== "image",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { assetType?: string } | undefined;
          if (parent?.assetType === "image" && !value) {
            return "Image is required when asset type is Image";
          }
          return true;
        }),
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      group: "asset",
      description: "YouTube, Vimeo, or direct video URL.",
      hidden: ({ parent }) => parent?.assetType !== "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { assetType?: string } | undefined;
          if (parent?.assetType === "video") {
            if (!value) return "Video URL is required when asset type is Video";
            try {
              const u = new URL(String(value));
              if (u.protocol !== "http:" && u.protocol !== "https:") {
                return "Use an http(s) URL";
              }
            } catch {
              return "Enter a valid URL";
            }
          }
          return true;
        }),
    }),
    defineField({
      name: "file",
      title: "File (PDF)",
      type: "file",
      group: "asset",
      options: {
        accept: "application/pdf",
      },
      hidden: ({ parent }) => parent?.assetType !== "pdf",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { assetType?: string } | undefined;
          if (parent?.assetType === "pdf" && !value) {
            return "PDF file is required when asset type is PDF";
          }
          return true;
        }),
    }),

    defineField({
      name: "altText",
      title: "Alt text",
      type: "string",
      group: "meta",
      description: "Required for images (accessibility + SEO).",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { assetType?: string } | undefined;
          if (parent?.assetType === "image" && !value?.trim()) {
            return "Alt text is required for images";
          }
          return true;
        }),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      group: "meta",
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
      group: "meta",
      description: 'e.g. "© AndeStay Hostel" / photographer credit.',
    }),
    defineField({
      name: "width",
      title: "Width (px)",
      type: "number",
      group: "meta",
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "height",
      title: "Height (px)",
      type: "number",
      group: "meta",
      validation: (Rule) => Rule.integer().min(1),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "org",
      options: {
        list: [...CATEGORIES],
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "org",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "org",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      group: "org",
      description: "Sort within category (ascending).",
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      assetType: "assetType",
      media: "image",
      featured: "featured",
      order: "order",
    },
    prepare({ title, category, assetType, media, featured, order }) {
      const typeLabel = assetType || "asset";
      const catLabel = category || "uncategorized";
      const star = featured ? "★ " : "";
      return {
        title: `${star}${title || "Untitled asset"}`,
        subtitle: `${catLabel} · ${typeLabel} · #${order ?? "—"}`,
        media,
      };
    },
  },
});
