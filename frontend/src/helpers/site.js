export const SITE = {
  name: "CAKE'O clock",
  legalName: "Cake'O Clock",
  tagline: "Handcrafted celebration cakes, baked fresh to order.",
  description:
    "Bespoke birthday, wedding and dessert cakes made by hand in Sri Lanka. Every design is customised to your celebration and delivered fresh.",

  phone: "+94710961790",
  phoneDisplay: "+94 71 0961790",
  whatsapp: "94710961790",

  email: "orders@cakeoclock.lk",
  address: "Cake o'Clock, Upathissa Mawatha, Matara 81000",
  mapUrl: "https://maps.app.goo.gl/KxB5zhQwHYfTRgNa7?g_st=ic",

  hours: [
    { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
    { day: "Saturday", time: "9:00 AM – 9:00 PM" },
    { day: "Sunday", time: "10:00 AM – 6:00 PM" },
  ],

  socials: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/94710961790",
  },
};

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Reviews", to: "/reviews" },
];

export const formatPrice = (value) =>
  `Rs ${Number(value || 0).toLocaleString("en-LK")}`;
