export interface IslaVistaProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  subcollection: string
  image: string
  tiktokUrl?: string
  sku: string
}

export interface IslaVistaSubCollection {
  id: string
  name: string
  tagline: string
  description: string
  products: IslaVistaProduct[]
  tiktokVideoId?: string
  icon: string
}

export const ISLA_VISTA_SUBCOLLECTIONS: IslaVistaSubCollection[] = [
  {
    id: "dawn-patrol",
    name: "Dawn Patrol",
    tagline: "Early morning vibes for the committed",
    description: "Lightweight and breathable essentials for those early morning sessions.",
    icon: "🌅",
    tiktokVideoId: "7384920284729393434",
    products: [
      {
        id: "dp-tee-01",
        name: "Dawn Patrol T-Shirt",
        description: "Breathable organic cotton tee perfect for pre-sunrise sessions",
        price: 45,
        category: "tops",
        subcollection: "dawn-patrol",
        image: "/products/dawn-patrol-tee.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7384920284729393434",
        sku: "DP-TEE-001"
      },
      {
        id: "dp-shorts-01",
        name: "Dawn Patrol Shorts",
        description: "Quick-dry shorts with hidden pockets",
        price: 65,
        category: "bottoms",
        subcollection: "dawn-patrol",
        image: "/products/dawn-patrol-shorts.png",
        sku: "DP-SHORT-001"
      }
    ]
  },
  {
    id: "beach-break",
    name: "Beach Break",
    tagline: "Midday essentials for liquid sessions",
    description: "Technical gear designed for water and sandy beaches.",
    icon: "🏄",
    tiktokVideoId: "7385681925384920284",
    products: [
      {
        id: "bb-rashguard-01",
        name: "Beach Break Rashguard",
        description: "UPF 50+ protection with seamless construction",
        price: 75,
        category: "tops",
        subcollection: "beach-break",
        image: "/products/beach-break-rashguard.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7385681925384920284",
        sku: "BB-RASH-001"
      },
      {
        id: "bb-boardshorts-01",
        name: "Beach Break Boardshorts",
        description: "Performance boardshorts with rapid dry technology",
        price: 85,
        category: "bottoms",
        subcollection: "beach-break",
        image: "/products/beach-break-boardshorts.png",
        sku: "BB-BOARD-001"
      }
    ]
  },
  {
    id: "sunset-session",
    name: "Sunset Session",
    tagline: "Golden hour essentials",
    description: "Premium pieces for evening adventures when the light is golden.",
    icon: "🌅",
    tiktokVideoId: "7386473029384029385",
    products: [
      {
        id: "ss-overshirt-01",
        name: "Sunset Session Overshirt",
        description: "Lightweight linen blend perfect for layering",
        price: 95,
        category: "tops",
        subcollection: "sunset-session",
        image: "/products/sunset-overshirt.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7386473029384029385",
        sku: "SS-OVER-001"
      },
      {
        id: "ss-trousers-01",
        name: "Sunset Session Trousers",
        description: "Relaxed fit with premium fabric",
        price: 105,
        category: "bottoms",
        subcollection: "sunset-session",
        image: "/products/sunset-trousers.png",
        sku: "SS-TROUS-001"
      }
    ]
  },
  {
    id: "campus-cruiser",
    name: "Campus Cruiser",
    tagline: "Everyday college essentials",
    description: "Comfortable and stylish pieces for daily campus life.",
    icon: "🎒",
    tiktokVideoId: "7387264183829374920",
    products: [
      {
        id: "cc-hoodie-01",
        name: "Campus Cruiser Hoodie",
        description: "Oversized fit with EC embroidery",
        price: 75,
        category: "tops",
        subcollection: "campus-cruiser",
        image: "/products/campus-hoodie.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7387264183829374920",
        sku: "CC-HOOD-001"
      },
      {
        id: "cc-joggers-01",
        name: "Campus Cruiser Joggers",
        description: "Comfortable joggers with tapered ankle",
        price: 65,
        category: "bottoms",
        subcollection: "campus-cruiser",
        image: "/products/campus-joggers.png",
        sku: "CC-JOG-001"
      }
    ]
  },
  {
    id: "weekend-escape",
    name: "Weekend Escape",
    tagline: "Adventure-ready pieces",
    description: "Technical and style-forward gear for weekend getaways.",
    icon: "🏕",
    tiktokVideoId: "7388048293029384029",
    products: [
      {
        id: "we-jacket-01",
        name: "Weekend Escape Jacket",
        description: "Weatherproof with packable design",
        price: 125,
        category: "outerwear",
        subcollection: "weekend-escape",
        image: "/products/weekend-jacket.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7388048293029384029",
        sku: "WE-JACK-001"
      },
      {
        id: "we-cargo-01",
        name: "Weekend Escape Cargo Pants",
        description: "Multiple pockets with utility design",
        price: 95,
        category: "bottoms",
        subcollection: "weekend-escape",
        image: "/products/weekend-cargo.png",
        sku: "WE-CARG-001"
      }
    ]
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    tagline: "Premium lifestyle collection",
    description: "Elevated pieces for refined coastal living.",
    icon: "✨",
    tiktokVideoId: "7388829384029384029",
    products: [
      {
        id: "gh-linen-shirt-01",
        name: "Golden Hour Linen Shirt",
        description: "100% premium linen with mother of pearl buttons",
        price: 135,
        category: "tops",
        subcollection: "golden-hour",
        image: "/products/golden-linen.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7388829384029384029",
        sku: "GH-LIN-001"
      },
      {
        id: "gh-chinos-01",
        name: "Golden Hour Chinos",
        description: "Tailored fit with subtle texture",
        price: 115,
        category: "bottoms",
        subcollection: "golden-hour",
        image: "/products/golden-chinos.png",
        sku: "GH-CHIN-001"
      }
    ]
  },
  {
    id: "salt-sand",
    name: "Salt & Sand",
    tagline: "Accessories & essentials",
    description: "Complete your look with our curated accessories.",
    icon: "⌚",
    tiktokVideoId: "7389610293039384920",
    products: [
      {
        id: "ss-cap-01",
        name: "Salt & Sand Cap",
        description: "Structured cap with embroidered logo",
        price: 35,
        category: "accessories",
        subcollection: "salt-sand",
        image: "/products/salt-sand-cap.png",
        tiktokUrl: "https://www.tiktok.com/@eliascharles/video/7389610293039384920",
        sku: "SS-CAP-001"
      },
      {
        id: "ss-bag-01",
        name: "Salt & Sand Crossbody",
        description: "Waterproof crossbody with adjustable strap",
        price: 85,
        category: "accessories",
        subcollection: "salt-sand",
        image: "/products/salt-sand-bag.png",
        sku: "SS-BAG-001"
      }
    ]
  }
]

export const ISLA_VISTA_BOX_SUGGESTION = {
  name: "Isla Vista Essentials Box",
  description: "A curated 7-piece collection capturing the essence of Isla Vista lifestyle",
  products: [
    "dp-tee-01",
    "bb-boardshorts-01",
    "ss-overshirt-01",
    "cc-hoodie-01",
    "ss-cap-01",
    "we-jacket-01",
    "gh-linen-shirt-01"
  ],
  valueIfBought: 615,
  boxPrice: 499,
  savings: 116
}

export function getSubCollectionById(id: string): IslaVistaSubCollection | undefined {
  return ISLA_VISTA_SUBCOLLECTIONS.find(sc => sc.id === id)
}

export function getProductById(id: string): IslaVistaProduct | undefined {
  for (const subcollection of ISLA_VISTA_SUBCOLLECTIONS) {
    const product = subcollection.products.find(p => p.id === id)
    if (product) return product
  }
  return undefined
}
