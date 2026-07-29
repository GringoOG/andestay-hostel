export const site = {
  name: "AndeStay Hostel",
  tagline: "Your base in the Andes.",
  location: "Colpapampa",
  email: "hello@andestayhostel.com",
  phone: "+51 000 000 000",
  phoneHref: "tel:+51000000000",
  address: "Colpapampa, Peru",
  mapsUrl: "https://maps.google.com/?q=Colpapampa+Peru",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/the-cabana", label: "About" },
  { href: "/accommodation", label: "Rooms" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Photo map (foto Leňa):
 * 8365 → hero (landing — do not replace)
 * 8107, 8109, 8114, 8272, 8321, 8322, 8335, 8363, 8364 → used across sections
 */
export const images = {
  /** IMG_8365 — fixed landing hero */
  hero: "/images/hero.jpg",
  /** IMG_8322 */
  aboutHero: "/images/lena-8322.jpg",
  lastingA: "/images/lena-8321.jpg",
  lastingB: "/images/lena-8335.jpg",
  avatars: [
    "/images/avatar-1.jpg",
    "/images/avatar-2.jpg",
    "/images/avatar-3.jpg",
    "/images/avatar-4.jpg",
  ],
} as const;

export const cabins = [
  {
    id: "double-room",
    name: "Double room",
    blurb:
      "Dvoulůžkový pokoj — two single beds for a comfortable night after the trail.",
    price: 45,
    features: [
      "2 guests",
      "2 single beds (jednolůžkové postele)",
      "Mountain views from the cabin",
      "Warm Andean textiles and wood interiors",
      "Quiet hillside setting",
    ],
    photoLabel: "Double room interior",
    /** IMG_8109 */
    image: "/images/lena-8109.jpg",
  },
  {
    id: "family-room",
    name: "Family room",
    blurb: "Rodinný pokoj — one large double bed for couples or a small family stop.",
    price: 65,
    features: [
      "2 guests (extra bed on request)",
      "1 large double bed (velká manželská postel)",
      "More space for bags and gear",
      "Quiet corner of the hillside",
      "Perfect after long hiking days",
    ],
    photoLabel: "Family cabin with valley view",
    /** IMG_8364 */
    image: "/images/lena-8364.jpg",
  },
  {
    id: "triple-room",
    name: "Triple room",
    blurb: "Třílůžkový pokoj — three single beds for friends and small hiking groups.",
    price: 75,
    features: [
      "3 guests",
      "3 single beds (jednolůžkové postele)",
      "Room to spread out after long days",
      "Shared mountain atmosphere",
      "Best value for three travelers",
    ],
    photoLabel: "Triple room morning view",
    /** IMG_8107 */
    image: "/images/lena-8107.jpg",
  },
  {
    id: "deluxe-room",
    name: "Deluxe",
    blurb:
      "Deluxe cabin for two — manželská postel and a private bathroom.",
    price: 95,
    features: [
      "2 guests",
      "1 double bed (manželská postel)",
      "Private bathroom",
      "Extra comfort and privacy",
      "Ideal for couples",
    ],
    photoLabel: "Deluxe cabin",
    /** Placeholder — replace when you send the Deluxe photo */
    image: "/images/lena-8363.jpg",
  },
  {
    id: "deluxe-family-room",
    name: "Deluxe family",
    blurb:
      "Deluxe family cabin — manželská postel plus one single bed, with a private bathroom.",
    price: 115,
    features: [
      "3 guests",
      "1 double bed + 1 single bed",
      "Private bathroom",
      "Space for a couple + child or friend",
      "Extra comfort and privacy",
    ],
    photoLabel: "Deluxe family cabin",
    /** Placeholder — replace when you send the Deluxe family photo */
    image: "/images/lena-8363.jpg",
  },
] as const;

export const aboutCards = [
  {
    title: "Nature",
    description: "Andean views at every sunrise.",
    photoLabel: "View from the room",
    image: "/images/lena-8109.jpg",
  },
  {
    title: "Cabins",
    description: "Red roofs in the green valley.",
    photoLabel: "Cabin row",
    image: "/images/lena-8114.jpg",
  },
  {
    title: "Comfort",
    description: "Cozy rooms with mountain calm.",
    photoLabel: "Cabins on the hillside",
    image: "/images/lena-8363.jpg",
  },
  {
    title: "Moments",
    description: "A home along the Andes trail.",
    photoLabel: "Balcony valley view",
    image: "/images/lena-8321.jpg",
  },
] as const;

/** Horizontal About gallery — every Leňa photo (hero 8365 stays landing-only as main, also appears here) */
export const aboutGallery = [
  {
    title: "Interior",
    description: "Wake up to the mountain.",
    photoLabel: "IMG_8107",
    image: "/images/lena-8107.jpg",
  },
  {
    title: "Room",
    description: "Wood, textiles, and light.",
    photoLabel: "IMG_8109",
    image: "/images/lena-8109.jpg",
  },
  {
    title: "Village",
    description: "Cabins in the valley.",
    photoLabel: "IMG_8114",
    image: "/images/lena-8114.jpg",
  },
  {
    title: "Stay",
    description: "Work and rest with a view.",
    photoLabel: "IMG_8272",
    image: "/images/lena-8272.jpg",
  },
  {
    title: "Balcony",
    description: "Open air above Colpapampa.",
    photoLabel: "IMG_8321",
    image: "/images/lena-8321.jpg",
  },
  {
    title: "Valley",
    description: "A lasting mountain horizon.",
    photoLabel: "IMG_8322",
    image: "/images/lena-8322.jpg",
  },
  {
    title: "Stilts",
    description: "Cabins perched on the slope.",
    photoLabel: "IMG_8335",
    image: "/images/lena-8335.jpg",
  },
  {
    title: "Decks",
    description: "Green roofs, open sky.",
    photoLabel: "IMG_8363",
    image: "/images/lena-8363.jpg",
  },
  {
    title: "Outlook",
    description: "Terrace over the valley.",
    photoLabel: "IMG_8364",
    image: "/images/lena-8364.jpg",
  },
  {
    title: "Home",
    description: "AndeStay in Colpapampa.",
    photoLabel: "IMG_8365",
    image: "/images/lena-8365.jpg",
  },
] as const;

export const aboutStory = {
  badge: "About AndeStay",
  title: "Rest after the trail. Eat well. Recharge for what comes next.",
  paragraphs: [
    "Rest after a demanding day on the Salkantay trek in a cozy hostel surrounded by the majestic Peruvian Andes. AndeStay Hostel Colpapampa is where you recover after a long journey, eat well, and gather strength for the next adventure.",
    "Every guest receives an American breakfast and a homemade dinner free of charge, so you don’t need to look for a restaurant on arrival. Simply enjoy the calm atmosphere, comfortable rooms, and the nature around you.",
    "We offer comfortable rooms for individuals, couples, and families, free Wi-Fi, a garden to unwind in, and a friendly environment where you’ll feel at home.",
  ],
  closing:
    "Whether you’re heading to Machu Picchu or finishing a stage of the Salkantay trek, AndeStay Hostel Colpapampa is the ideal place for quality rest, good food, and a pleasant night in the heart of the Peruvian Andes.",
  whyTitle: "Why choose AndeStay?",
  why: [
    "Free homemade dinner",
    "American breakfast included",
    "Free Wi-Fi",
    "Family rooms",
    "Non-smoking rooms",
    "Quiet garden to relax",
    "Bedding and towels included",
  ],
} as const;

export const heroCopy = {
  badge: "Escape. Breathe. Belong.",
  support:
    "Rest after the Salkantay trek. Breakfast and homemade dinner are always included.",
} as const;

export const floatingQuotes = [
  { quote: "Exactly what we needed.", side: "left" as const },
  { quote: "The silence was the best part.", side: "right" as const },
  { quote: "Waking up to this view felt unreal.", side: "left" as const },
  { quote: "It felt like time moved differently here.", side: "right" as const },
];

export const testimonials = [
  {
    name: "Liam S.",
    from: "from California/USA",
    text: "We stayed in the family room and it was simply amazing. The sunrise view over the valley is breathtaking. The cabin is so cozy and made us feel at home.",
    avatar: "/images/lena-8364.jpg",
  },
  {
    name: "Jack M.",
    from: "from New York/USA",
    text: "We booked the double room for a quiet stop on our trek and couldn’t have made a better choice. From the moment we arrived, the place felt magical. The mountain scenery and warm cabin created the perfect atmosphere for us to slow down and rest. The attention to detail and the warmth of the hosts made the experience even more special. It’s the kind of place you want to return to every year.",
    avatar: "/images/lena-8109.jpg",
  },
  {
    name: "Caroline S.",
    from: "from London",
    text: "A perfect base to rest and recharge. We took the triple room with friends — between the trails and nights under the stars, every detail made our stay unforgettable.",
    avatar: "/images/lena-8335.jpg",
  },
] as const;

export const faqs = [
  {
    q: "What time is check-in and check-out?",
    a: "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early check-in or late check-out may be available upon request, depending on availability.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 7 days before arrival. Cancellations made within 7 days of check-in are non-refundable. We recommend travel insurance for unexpected changes.",
  },
  {
    q: "Are pets welcome at AndeStay Hostel?",
    a: "Please contact us before booking if you plan to travel with a pet. Availability depends on the room type and current guests.",
  },
  {
    q: "Can we bring children or babies?",
    a: "Yes — children and babies are welcome. Let us know in advance so we can prepare the right room setup.",
  },
  {
    q: "Where is AndeStay Hostel located, and how do I get there?",
    a: "We’re in Colpapampa, Peru. Detailed arrival instructions are sent after your reservation is confirmed.",
  },
] as const;
