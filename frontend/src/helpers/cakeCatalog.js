import BirthdayImage from "../assets/birthday.jpg";
import CupcakeImage from "../assets/cup.jpg";
import AnniversaryImage from "../assets/anniversary.jpg";
import JarImage from "../assets/jar.jpg";
import WeddingStructureImage from "../assets/weddingstructure.jpg";
import WeddingCakeImage from "../assets/weddingcake.jpg";
import { BirthdayCakes } from "./BirthdayLists";
import { CupCakes } from "./CupcakeLists";
import { AnniversaryCakes } from "./AnniversaryList";
import { weddingStructure } from "./StructureList";

/**
 * Single source of truth for every cake category.
 * `type` matches the backend enum in backend/models/cake.js so the catalogue
 * can be joined directly against the API.
 */
export const CAKE_CATEGORIES = [
  {
    id: "birthday",
    type: "Birthday Cake",
    title: "Birthday Cakes",
    shortTitle: "Birthday",
    tagline: "Make their day unforgettable",
    description:
      "Personalised birthday cakes in every size and flavour, finished with your message, colours and favourite details.",
    image: BirthdayImage,
    to: "/birthdaycake",
    priceFrom: 4800,
    priceTo: 4800,
    designs: 40,
    accent: "#c2456f",
    staticCakes: BirthdayCakes,
  },
  {
    id: "cupcake",
    type: "Cupcake",
    title: "Cup Cakes",
    shortTitle: "Cupcakes",
    tagline: "Little cakes, big flavour",
    description:
      "Boxes of hand-piped cupcakes in assorted flavours — perfect for parties, offices and dessert tables.",
    image: CupcakeImage,
    to: "/cupcake",
    priceFrom: 2500,
    priceTo: 5500,
    designs: 16,
    accent: "#e08a5d",
    staticCakes: CupCakes,
  },
  {
    id: "anniversary",
    type: "Anniversary Cake",
    title: "Anniversary Cakes",
    shortTitle: "Anniversary",
    tagline: "Celebrate your milestones",
    description:
      "Elegant romantic tiers for anniversaries, with delicate finishes, florals and personalised message plaques.",
    image: AnniversaryImage,
    to: "/anniversarycake",
    priceFrom: 5000,
    priceTo: 5000,
    designs: 16,
    accent: "#a8437c",
    staticCakes: AnniversaryCakes,
  },
  {
    id: "jar",
    type: "Jar Cake",
    title: "Jar Cakes",
    shortTitle: "Jar Cakes",
    tagline: "Layered goodness in a jar",
    description:
      "Decadent layered jar cakes with cream, sponge and toppings — grab one or build a gift set of six.",
    image: JarImage,
    to: "/jarcake",
    priceFrom: 1500,
    priceTo: 1500,
    designs: 1,
    accent: "#c98a3e",
    staticCakes: [{ image: JarImage, price: 1500 }],
  },
  {
    id: "wedding-structure",
    type: "Wedding Structure",
    title: "Wedding Structures",
    shortTitle: "Structures",
    tagline: "Grand centrepieces for your day",
    description:
      "Statement cake structures and table displays engineered for large weddings, with delivery and setup included.",
    image: WeddingStructureImage,
    to: "/weddingStructures",
    priceFrom: 55000,
    priceTo: 55000,
    designs: 25,
    accent: "#7d6bab",
    staticCakes: weddingStructure,
  },
  {
    id: "wedding-cake",
    type: "Wedding Cake",
    title: "Wedding Cakes",
    shortTitle: "Wedding",
    tagline: "The centrepiece of your vows",
    description:
      "Classic tiered wedding cakes in ivory, blush and gold — designed to match your theme and sized for your guest count.",
    image: WeddingCakeImage,
    to: "/weddingcakes",
    priceFrom: 8000,
    priceTo: 8000,
    designs: 1,
    accent: "#b99a6b",
    staticCakes: [{ image: WeddingCakeImage, price: 8000 }],
  },
];

export const getCategory = (id) =>
  CAKE_CATEGORIES.find((category) => category.id === id);
