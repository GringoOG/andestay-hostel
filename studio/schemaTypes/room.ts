import { defineArrayMember, defineField, defineType } from "sanity";
import {
  imageAssetReference,
  imageAssetReferenceArray,
} from "./objects/mediaAssetRef";

/**
 * Room — Sanity document aligned with ContentRepository / future booking.
 * Media via Asset Library references (no duplicate uploads).
 */
export const room = defineType({
  name: "room",
  title: "Room",
  type: "document",
  orderings: [
    {
      title: "Order (asc)",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Order (desc)",
      name: "orderDesc",
      by: [{ field: "order", direction: "desc" }],
    },
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "pricing", title: "Pricing & capacity" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "id",
      title: "ID",
      type: "string",
      description:
        'Stable business id, e.g. "simple-room". Used by ContentRepository & booking map.',
      group: "content",
      validation: (Rule) =>
        Rule.required()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            name: "kebab-case",
            invert: false,
          })
          .error("Use kebab-case id (e.g. double-room)"),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "id",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      group: "content",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Display / list order (ascending).",
      group: "content",
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "string",
      description: 'Optional chip, e.g. "Popular" / "Best for couples".',
      group: "content",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "photoLabel",
      title: "Photo label",
      type: "string",
      description: "Alt / caption for cards (maps to ContentRepository subtitle).",
      group: "content",
      validation: (Rule) => Rule.required().min(2).max(160),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => Rule.required().min(10).max(280),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 8,
      group: "content",
      validation: (Rule) => Rule.required().min(20),
    }),
    defineField({
      name: "amenities",
      title: "Amenities",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: "pricePen",
      title: "Price (PEN / night)",
      type: "number",
      group: "pricing",
      validation: (Rule) => Rule.required().integer().min(0),
    }),
    defineField({
      name: "units",
      title: "Units (inventory)",
      type: "number",
      description: "Physical cabins of this type — future booking availability.",
      group: "pricing",
      initialValue: 1,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "capacityAdults",
      title: "Capacity — adults",
      type: "number",
      group: "pricing",
      validation: (Rule) => Rule.required().integer().min(1).max(20),
    }),
    defineField({
      name: "capacityChildren",
      title: "Capacity — children",
      type: "number",
      group: "pricing",
      initialValue: 0,
      validation: (Rule) => Rule.required().integer().min(0).max(20),
    }),
    defineField({
      name: "beds",
      title: "Beds",
      type: "string",
      description: 'e.g. "2 single beds" / "1 large double bed".',
      group: "pricing",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      description: 'Optional, e.g. "18 m²".',
      group: "pricing",
    }),
    defineField({
      name: "breakfastIncluded",
      title: "Breakfast included",
      type: "boolean",
      group: "pricing",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dinnerIncluded",
      title: "Dinner included",
      type: "boolean",
      group: "pricing",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),

    imageAssetReference({
      name: "coverImage",
      title: "Cover image",
      description: "From Media Library (category: room recommended).",
      group: "media",
      required: true,
    }),
    imageAssetReference({
      name: "heroImage",
      title: "Hero image",
      description: "Optional. From Media Library; falls back to cover if empty.",
      group: "media",
    }),
    imageAssetReferenceArray({
      name: "gallery",
      title: "Gallery",
      description: "Media Library assets — drag to reorder.",
      group: "media",
    }),

    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: "name",
      id: "id",
      order: "order",
      active: "active",
      media: "coverImage.image",
      pricePen: "pricePen",
    },
    prepare({ title, id, order, active, media, pricePen }) {
      const status = active === false ? "Inactive" : "Active";
      const price =
        typeof pricePen === "number" ? ` · PEN ${pricePen}` : "";
      return {
        title: title || "Untitled room",
        subtitle: `#${order ?? "—"} · ${status} · ${id || "no-id"}${price}`,
        media,
      };
    },
  },
});
