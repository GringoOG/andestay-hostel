import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const SITE_SETTINGS_ID = "siteSettings";
const HOMEPAGE_ID = "homepage";

/**
 * Standalone Sanity Studio for AndeStay Hostel.
 * Project: nnfu4wmn · Dataset: production
 */
export default defineConfig({
  name: "andestay",
  title: "AndeStay Hostel",

  projectId: "nnfu4wmn",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage")
              .id(HOMEPAGE_ID)
              .child(
                S.document()
                  .schemaType("homepage")
                  .documentId(HOMEPAGE_ID)
                  .title("Homepage"),
              ),
            S.listItem()
              .title("Site settings")
              .id(SITE_SETTINGS_ID)
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId(SITE_SETTINGS_ID)
                  .title("Site settings"),
              ),
            S.divider(),
            S.listItem()
              .title("Rooms")
              .schemaType("room")
              .child(
                S.documentTypeList("room")
                  .title("Rooms")
                  .defaultOrdering([{ field: "order", direction: "asc" }]),
              ),
            S.listItem()
              .title("Media Library")
              .schemaType("mediaAsset")
              .child(
                S.documentTypeList("mediaAsset")
                  .title("Media Library")
                  .defaultOrdering([
                    { field: "category", direction: "asc" },
                    { field: "order", direction: "asc" },
                  ]),
              ),
            ...S.documentTypeListItems().filter(
              (item) =>
                item.getId() !== "room" &&
                item.getId() !== "siteSettings" &&
                item.getId() !== "mediaAsset" &&
                item.getId() !== "homepage",
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
