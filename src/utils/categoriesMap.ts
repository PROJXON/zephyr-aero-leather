import type { Category } from "../../types/types";

const categoriesMap: Record<string, Category> = {
  wallets: {
    name: "Wallets",
    description: "Crafted for durability and timeless elegance",
    image: "/categories/wallet.jpg",
    slugs: ["wallets"],
  },
  iphoneCases: {
    name: "iPhone Leather Cases",
    description: "Protection with style, designed for your device",
    image: "/categories/iphonecase.jpg",
    slugs: ["iphone-cases"],
  },
  sunglasses: {
    name: "Sunglass Cases",
    description: "Keep your shades safe in premium leather",
    image: "/categories/sunglassescase.jpg",
    slugs: [
      "sunglasses-cases-small",
      "sunglasses-cases-medium",
      "sunglasses-cases-large",
      "sunglasses-cases-reading",
      "sunglasses-cases-folding",
      "sunglasses-cases-sport",
    ],
  },
  belts: {
    name: "Belts",
    description: "Classic, rugged, and built to last",
    image: "/categories/belts.jpg",
    slugs: ["belts"],
  },
  bags: {
    name: "Bags",
    description: "Functional luxury for your every journey",
    image: "/categories/bag.jpg",
    slugs: ["belt-bags", "tote-bags"],
  },
  holsters: {
    name: "Shoulder Holsters",
    description: "Tactical elegance meets everyday carry",
    image: "/categories/holster.jpg",
    slugs: ["shoulder-holsters"],
  },
  moto: {
    name: "Moto Guzzi Collection",
    description: "Inspired by the ride, designed for the road",
    image: "/categories/motoguzzi.webp",
    slugs: ["moto-guzzi"],
  },
};

export default categoriesMap;