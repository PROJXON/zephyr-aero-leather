const categoryMap = {
  wallets: ["wallets"],
  iphoneCases: ["iphone-cases"],
  sunglasses: [
    "sunglasses-cases-small",
    "sunglasses-cases-medium",
    "sunglasses-cases-large",
    "sunglasses-cases-reading",
    "sunglasses-cases-folding",
    "sunglasses-cases-sport",
  ],
  belts: ["belts"],
  bags: ["belt-bags", "tote-bags"],
  moto: ["moto-guzzi"],
  holsters: ["shoulder-holsters"],
} as const;

export default categoryMap;
