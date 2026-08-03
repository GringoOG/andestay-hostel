import { defineArrayMember, defineField, defineType } from "sanity";
import {
  imageAssetReference,
  imageAssetReferenceArray,
} from "./objects/mediaAssetRef";

/**
 * Homepage — singleton marketing page content.
 * Media via Asset Library references. documentId: homepage
 */
export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "about", title: "About" },
    { name: "features", title: "Features" },
    { name: "gallery", title: "Gallery" },
    { name: "cta", title: "CTA" },
  ],
  fields: [
    // ── 1. Hero ─────────────────────────────────────────────
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 3,
      group: "hero",
      validation: (Rule) => Rule.required().min(5).max(280),
    }),
    imageAssetReference({
      name: "heroMedia",
      title: "Hero media",
      description: "From Media Library (category: homepage recommended).",
      group: "hero",
      required: true,
    }),
    defineField({
      name: "ctaText",
      title: "CTA text",
      type: "string",
      group: "hero",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "ctaLink",
      title: "CTA link",
      type: "string",
      group: "hero",
      description: "Internal path (/accommodation) or absolute URL.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value || typeof value !== "string") return "Required";
          const v = value.trim();
          if (v.startsWith("/")) return true;
          try {
            const u = new URL(v);
            if (u.protocol === "http:" || u.protocol === "https:") return true;
          } catch {
            /* fall through */
          }
          return "Use a path starting with / or a valid http(s) URL";
        }),
    }),

    // ── 2. About ────────────────────────────────────────────
    defineField({
      name: "aboutTitle",
      title: "About title",
      type: "string",
      group: "about",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "aboutText",
      title: "About text",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    imageAssetReference({
      name: "aboutImage",
      title: "About image",
      description: "From Media Library.",
      group: "about",
      required: true,
    }),

    // ── 3. Features ─────────────────────────────────────────
    defineField({
      name: "features",
      title: "Features / Why stay with us",
      type: "array",
      group: "features",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          title: "Feature",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              description: 'Icon name key, e.g. "wifi", "breakfast", "mountain".',
              validation: (Rule) => Rule.required().min(1).max(60),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required().min(2).max(80),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required().min(5).max(280),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
              icon: "icon",
            },
            prepare({ title, subtitle, icon }) {
              return {
                title: title || "Feature",
                subtitle: icon ? `${icon} · ${subtitle || ""}` : subtitle,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).max(12),
    }),

    // ── 4. Gallery ──────────────────────────────────────────
    defineField({
      name: "gallerySectionTitle",
      title: "Gallery section title",
      type: "string",
      group: "gallery",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    imageAssetReferenceArray({
      name: "galleryItems",
      title: "Gallery items",
      description: "Media Library assets — drag to reorder.",
      group: "gallery",
    }),

    // ── 5. CTA ──────────────────────────────────────────────
    defineField({
      name: "ctaTitle",
      title: "CTA title",
      type: "string",
      group: "cta",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA description",
      type: "text",
      rows: 3,
      group: "cta",
      validation: (Rule) => Rule.required().min(5).max(280),
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA button text",
      type: "string",
      group: "cta",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "ctaButtonLink",
      title: "CTA button link",
      type: "string",
      group: "cta",
      description: "Internal path (/book) or absolute URL.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value || typeof value !== "string") return "Required";
          const v = value.trim();
          if (v.startsWith("/")) return true;
          try {
            const u = new URL(v);
            if (u.protocol === "http:" || u.protocol === "https:") return true;
          } catch {
            /* fall through */
          }
          return "Use a path starting with / or a valid http(s) URL";
        }),
    }),
  ],
  preview: {
    select: {
      subtitle: "heroTitle",
      media: "heroMedia.image",
    },
    prepare({ subtitle, media }) {
      return {
        title: "Homepage",
        subtitle: subtitle || "Configure landing page sections",
        media,
      };
    },
  },
});
