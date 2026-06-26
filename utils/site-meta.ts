const SITE_URL = "https://billsend.io";
const SITE_NAME = "billsend";

export const SITE_TITLE = "billsend: Free, Private Invoice Generator";

export const SITE_DESCRIPTION =
  "Create and download professional invoices for free, right in your browser. No accounts, no servers, and nothing ever leaves your device.";

const SITE_OG_IMAGE = `${SITE_URL}/billsend.png`;

export function siteMeta() {
  return [
    {
      title: SITE_TITLE
    },
    {
      name: "description",
      content: SITE_DESCRIPTION
    },
    {
      property: "og:type",
      content: "website"
    },
    {
      property: "og:site_name",
      content: SITE_NAME
    },
    {
      property: "og:url",
      content: SITE_URL
    },
    {
      property: "og:title",
      content: SITE_TITLE
    },
    {
      property: "og:description",
      content: SITE_DESCRIPTION
    },
    {
      property: "og:image",
      content: SITE_OG_IMAGE
    },
    {
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      name: "twitter:title",
      content: SITE_TITLE
    },
    {
      name: "twitter:description",
      content: SITE_DESCRIPTION
    },
    {
      name: "twitter:image",
      content: SITE_OG_IMAGE
    }
  ];
}
