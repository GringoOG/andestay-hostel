export type CabinId =
  | "double-room"
  | "family-room"
  | "triple-room"
  | "deluxe-room"
  | "deluxe-family-room";

export type Messages = {
  nav: { home: string; about: string; rooms: string; contact: string };
  common: {
    bookStay: string;
    perNight: string;
    closeMenu: string;
    openMenu: string;
    language: string;
  };
  hero: {
    badge: string;
    unlockYour: string;
    refuge: string;
    inNature: string;
    support: string;
    socialProofBefore: string;
    socialProofBold: string;
    socialProofAfter: string;
  };
  intro: {
    badge: string;
    before: string;
    bold: string;
  };
  accommodations: {
    badge: string;
    titleBefore: string;
    titleBold: string;
    body: string;
  };
  aboutPage: {
    welcomeBadge: string;
    heroTitle: string;
    heroSupport: string;
    featuresBadge: string;
    featuresTitle: string;
  };
  aboutStory: {
    badge: string;
    title: string;
    paragraphs: [string, string, string];
    closing: string;
    whyTitle: string;
    why: [string, string, string, string, string, string, string];
  };
  aboutCards: Array<{ title: string; description: string }>;
  aboutGallery: Array<{ title: string; description: string }>;
  lasting: {
    title: string;
    quotes: [string, string, string, string];
  };
  testimonials: {
    badge: string;
    title: string;
    items: Array<{ name: string; from: string; text: string }>;
  };
  faq: {
    badge: string;
    title: string;
    items: Array<{ q: string; a: string }>;
  };
  contact: {
    badge: string;
    title: string;
    email: string;
    telephone: string;
    address: string;
    formIntro: string;
    name: string;
    message: string;
    send: string;
    pageBadge: string;
    pageTitle: string;
    pageBody: string;
  };
  bookPage: {
    badge: string;
    title: string;
    body: string;
    preferMessage: string;
  };
  footer: {
    taglineBefore: string;
    taglineEm: string;
  };
  cabins: Record<
    CabinId,
    { name: string; blurb: string; features: [string, string, string, string, string] }
  >;
};
