export type CabinId =
  | "double-room"
  | "matrimonial-room"
  | "triple-room"
  | "simple-room";

export type Messages = {
  nav: { home: string; about: string; rooms: string; transport: string; contact: string };
  common: {
    bookStay: string;
    perNight: string;
    perCabin: string;
    cabinsToBook: string;
    cabinsAvailable: string;
    dinnerBreakfastIncluded: string;
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
    directSaveBefore: string;
    directSaveBold: string;
    directSaveAfter: string;
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
    openInMaps: string;
    mapHint: string;
  };
  transportPage: {
    badge: string;
    title: string;
    body: string;
    askWhatsApp: string;
    note: string;
    offers: Array<{
      id: string;
      title: string;
      route: string;
      blurb: string;
      features: [string, string, string];
    }>;
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
