
// Home
// Collections:
// - Aviator:
// (Passport Wallet, Key chain, Sunglass case, eye glass case, Suitcase / Flight back)
// - Adventurer:
// (Wallet, Key chain, Sunglass case, eye glass case, Saddle bag)  
// - Traveler:
// (Wallet, Key chain, Sunglass case, eye glass case, duffle)
// - Commuter:
// (Wallet, Key chain, Sunglass case, eye glass case, Tote)
// - Minimalist:
// (Wallet, Key chain, Sunglass case, eye glass case, backpack)



const collectionMap = {
  aviator: {
    name: "Aviator",
    description: "For the high-flyer: travel-ready leather essentials",
    image: "/collections/aviatorcollection.jpg",
    productIds: [652, 614, 103, 104, 105], // Replace with real product IDs
    carouselImages: [
          "/collections/aviator/aviator1.jpg",
          "/collections/aviator/aviator2.jpg",
          "/collections/aviator/aviator3.jpg",
          "/collections/aviator/aviator4.jpg",
        ],
  },
  explorer: {
    name: "Explorer",
    description: "For the explorer: rugged leather staples built for the bold",
    image: "/collections/explorercollection.jpg",
    productIds: [106, 107, 108, 109, 110],
    carouselImages: [
          "/collections/explorer/explorer1.jpg",
          "/collections/explorer/explorer2.jpg",
          "/collections/explorer/explorer3.jpg",
          "/collections/explorer/explorer4.jpg",
        ],
  },
  traveler: {
    name: "Traveler",
    description: "For the jetsetter: sleek and practical leather designs",
    image: "/collections/travelercollection.jpg",
    productIds: [111, 112, 113, 114, 115],
    carouselImages: [
          "/collections/traveler/traveler1.jpg",
          "/collections/traveler/traveler2.jpg",
          "/collections/traveler/traveler3.jpg",
          "/collections/traveler/traveler4.jpg",
        ],
  },
  commuter: {
    name: "Commuter",
    description: "For the city-goer: everyday leather carry refined",
    image: "/collections/commutercollection.jpg",
    productIds: [116, 117, 118, 119, 120],
    carouselImages: [
          "/collections/commuter/commuter1.jpg",
          "/collections/commuter/commuter2.jpg",
          "/collections/commuter/commuter3.jpg",
          "/collections/commuter/commuter4.jpg",
        ],
  },
  minimalist: {
    name: "Minimalist",
    description: "For the sleek and simple: essentials, reimagined",
    image: "/collections/minimalistcollection.jpg",
    productIds: [121, 122, 123, 124, 125],
    carouselImages: [
          "/collections/minimalist/minimalist1.jpg",
          "/collections/minimalist/minimalist2.jpg",
          "/collections/minimalist/minimalist3.jpg",
          "/collections/minimalist/minimalist4.jpg",
        ],
  },
};

export default collectionMap;
