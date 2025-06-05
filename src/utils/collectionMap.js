
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
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

const collectionMap = {
  aviator: {
    name: "Aviator",
    description: "For the high-flyer: travel-ready leather essentials",
    image: `${CDN_URL}/collections/aviatorcollection.jpg`,
    productIds: [652, 614, 103, 104, 105], // Replace with real product IDs
    carouselImages: [
          `${CDN_URL}/collections/aviator/aviator1.jpg`,
          `${CDN_URL}/collections/aviator/aviator2.jpg`,
          `${CDN_URL}/collections/aviator/aviator3.jpg`,
          `${CDN_URL}/collections/aviator/aviator4.jpg`,
        ],
  },
  explorer: {
    name: "Explorer",
    description: "For the explorer: rugged leather staples built for the bold",
    image: `${CDN_URL}/collections/explorercollection.jpg`,
    productIds: [106, 107, 108, 109, 110],
    carouselImages: [
          `${CDN_URL}/collections/explorer/explorer1.jpg`,
          `${CDN_URL}/collections/explorer/explorer2.jpg`,
          `${CDN_URL}/collections/explorer/explorer3.jpg`,
          `${CDN_URL}/collections/explorer/explorer4.jpg`,
        ],
  },
  traveler: {
    name: "Traveler",
    description: "For the jetsetter: sleek and practical leather designs",
    image: `${CDN_URL}/collections/travelercollection.jpg`,
    productIds: [111, 112, 113, 114, 115],
    carouselImages: [
          `${CDN_URL}/collections/traveler/traveler1.jpg`,
          `${CDN_URL}/collections/traveler/traveler2.jpg`,
          `${CDN_URL}/collections/traveler/traveler3.jpg`,
          `${CDN_URL}/collections/traveler/traveler4.jpg`,
        ],
  },
  commuter: {
    name: "Commuter",
    description: "For the city-goer: everyday leather carry refined",
    image: `${CDN_URL}/collections/commutercollection.jpg`,
    productIds: [116, 117, 118, 119, 120],
    carouselImages: [
          `${CDN_URL}/collections/commuter/commuter1.jpg`,
          `${CDN_URL}/collections/commuter/commuter2.jpg`,
          `${CDN_URL}/collections/commuter/commuter3.jpg`,
          `${CDN_URL}/collections/commuter/commuter4.jpg`,
        ],
  },
  minimalist: {
    name: "Minimalist",
    description: "For the sleek and simple: essentials, reimagined",
    image: `${CDN_URL}/collections/minimalistcollection.jpg`,
    productIds: [121, 122, 123, 124, 125],
    carouselImages: [
          `${CDN_URL}/collections/minimalist/minimalist1.jpg`,
          `${CDN_URL}/collections/minimalist/minimalist2.jpg`,
          `${CDN_URL}/collections/minimalist/minimalist3.jpg`,
          `${CDN_URL}/collections/minimalist/minimalist4.jpg`,
        ],
  },
};

export default collectionMap;
