import { defineField, defineType } from "sanity";

/**
 * SiteSettings — singleton for hostel production site config.
 * Mapped later via ContentRepository (no UI wiring in this step).
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
    { name: "homepage", title: "Homepage" },
    { name: "seo", title: "SEO" },
    { name: "footer", title: "Footer" },
    { name: "business", title: "Business hours" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    // ── Basics ──────────────────────────────────────────────
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      group: "basics",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "basics",
      validation: (Rule) => Rule.required().min(2).max(160),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      group: "basics",
      validation: (Rule) => Rule.required().min(20).max(500),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "basics",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
      group: "basics",
      description: "Square icon (ideally 32×32 or 64×64).",
    }),

    // ── Contact ─────────────────────────────────────────────
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (Rule) =>
        Rule.required().email().error("Enter a valid email address"),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
      description: 'Display format, e.g. "+51 906 067 917".',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\+?[0-9\s\-()]{8,20}$/, {
            name: "phone",
            invert: false,
          })
          .error("Enter a valid phone number (digits, spaces, +, -)"),
    }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      group: "contact",
      description: 'E.164 digits preferred, e.g. "51906067917" or +51…',
      validation: (Rule) =>
        Rule.required()
          .regex(/^\+?[0-9\s\-()]{8,20}$/, {
            name: "whatsapp",
            invert: false,
          })
          .error("Enter a valid WhatsApp number"),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      group: "contact",
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps URL",
      type: "url",
      group: "contact",
      validation: (Rule) =>
        Rule.required().uri({ scheme: ["http", "https"] }),
    }),

    // ── Social ──────────────────────────────────────────────
    defineField({
      name: "facebook",
      title: "Facebook",
      type: "url",
      group: "social",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
      group: "social",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "bookingCom",
      title: "Booking.com",
      type: "url",
      group: "social",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "airbnb",
      title: "Airbnb",
      type: "url",
      group: "social",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tripadvisor",
      title: "Tripadvisor",
      type: "url",
      group: "social",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),

    // ── Homepage ────────────────────────────────────────────
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      group: "homepage",
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 3,
      group: "homepage",
      validation: (Rule) => Rule.required().min(5).max(280),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      group: "homepage",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroButtonText",
      title: "Hero button text",
      type: "string",
      group: "homepage",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "heroButtonLink",
      title: "Hero button link",
      type: "string",
      group: "homepage",
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

    // ── SEO ─────────────────────────────────────────────────
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
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      group: "seo",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
        }),
      ],
    }),

    // ── Footer ──────────────────────────────────────────────
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
      group: "footer",
      description: 'e.g. "© 2026 AndeStay Hostel".',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "text",
      rows: 3,
      group: "footer",
    }),

    // ── Business hours ──────────────────────────────────────
    defineField({
      name: "checkInTime",
      title: "Check-in time",
      type: "string",
      group: "business",
      description: 'e.g. "14:00"',
      validation: (Rule) =>
        Rule.required()
          .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
            name: "HH:mm",
            invert: false,
          })
          .error("Use 24h format HH:mm (e.g. 14:00)"),
    }),
    defineField({
      name: "checkOutTime",
      title: "Check-out time",
      type: "string",
      group: "business",
      description: 'e.g. "11:00"',
      validation: (Rule) =>
        Rule.required()
          .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
            name: "HH:mm",
            invert: false,
          })
          .error("Use 24h format HH:mm (e.g. 11:00)"),
    }),
    defineField({
      name: "breakfastTime",
      title: "Breakfast time",
      type: "string",
      group: "business",
      description: 'e.g. "07:00–09:00"',
      validation: (Rule) => Rule.required().min(3).max(40),
    }),
    defineField({
      name: "dinnerTime",
      title: "Dinner time",
      type: "string",
      group: "business",
      description: 'e.g. "18:30–20:00"',
      validation: (Rule) => Rule.required().min(3).max(40),
    }),

    // ── Settings ────────────────────────────────────────────
    defineField({
      name: "defaultCurrency",
      title: "Default currency",
      type: "string",
      group: "settings",
      initialValue: "PEN",
      options: {
        list: [
          { title: "PEN — Peruvian Sol", value: "PEN" },
          { title: "USD — US Dollar", value: "USD" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      group: "settings",
      initialValue: "es-PE",
      options: {
        list: [
          { title: "es-PE (Spanish — Peru)", value: "es-PE" },
          { title: "en (English)", value: "en" },
          { title: "es (Spanish)", value: "es" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "siteTitle",
      subtitle: "tagline",
      media: "logo",
      email: "email",
      phone: "phone",
    },
    prepare({ title, subtitle, media, email, phone }) {
      const contact = [email, phone].filter(Boolean).join(" · ");
      return {
        title: title || "Site settings",
        subtitle: subtitle
          ? `${subtitle}${contact ? ` · ${contact}` : ""}`
          : contact || "Configure hostel site",
        media,
      };
    },
  },
});
