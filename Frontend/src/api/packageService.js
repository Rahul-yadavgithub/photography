// Simulated API layer for Packages to match the admin structure
// This mocks fetching data from the backend database

const MOCK_CATEGORIES = [
  {
    id: "wedding-photography",
    name: "Wedding Photography",
    description: "Capture timeless wedding memories through luxury photography and cinematic storytelling.",
    banner: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920"
  },
  {
    id: "pre-wedding",
    name: "Pre-Wedding Shoot",
    description: "Creative and romantic pre-wedding stories designed around your unique journey.",
    banner: null
  },
  {
    id: "couple-shoot",
    name: "Couple Shoot",
    description: "Intimate and cinematic portraits capturing your everyday love story.",
    banner: null
  },
  {
    id: "tourist-photography",
    name: "Tourist Photography",
    description: "Memories of your travels preserved through professional lenses.",
    banner: null // This will be empty to test filtering
  }
];

const MOCK_DB = [
  {
    id: "silver-wedding",
    name: "Silver Wedding Package",
    category: "Wedding Photography",
    slug: "silver-wedding",
    shortStory: "Designed for couples who want timeless memories beautifully preserved through photography and cinematic storytelling.",
    fullStory: "Preserving every emotion, every smile, and every unforgettable moment through timeless imagery and cinematic storytelling. Our Silver Package provides comprehensive coverage for the most essential parts of your special day.",
    price: 5000,
    discountPrice: null,
    status: "Published",
    isFeatured: false,
    isPopular: false,
    showPricing: true,
    allowAddOns: true,
    
    media: {
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
      banner: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1920",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      gallery: [
        "https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=800"
      ]
    },

    features: [
      { id: 1, title: "Photography Coverage", description: "Professional photographer dedicated to capturing every meaningful moment of your celebration.", iconKey: "camera" },
      { id: 2, title: "Cinematic Coverage", description: "Dedicated wedding videographer capturing cinematic moments in 4K resolution.", iconKey: "video" },
      { id: 3, title: "Premium Editing Experience", description: "Receive a collection of 200+ professionally edited images crafted with color correction and artistic retouching.", iconKey: "gallery" },
      { id: 4, title: "Wedding Film Experience", description: "A cinematic wedding highlight film (3-5 mins) professionally edited to tell your story.", iconKey: "film" }
    ],

    addOns: [
      { id: 1, name: "Drone Coverage", description: "Capture breathtaking aerial perspectives of your celebration.", price: 500, iconKey: "drone" },
      { id: 2, name: "Premium Album", description: "Luxury handcrafted wedding album with premium materials.", price: 800, iconKey: "album" },
      { id: 3, name: "Extra Photographer", description: "Additional creative coverage for larger events.", price: 600, iconKey: "camera" }
    ],

    offer: null // No active offer
  },
  {
    id: "gold-wedding",
    name: "Gold Wedding Package",
    category: "Wedding Photography",
    slug: "gold-wedding",
    shortStory: "The perfect balance of comprehensive coverage, breathtaking drone visuals, and premium printed memories.",
    fullStory: "Our most popular choice. The Gold Package delivers an extraordinary storytelling experience with a dedicated team, stunning aerial cinematography, and handcrafted albums that will last generations.",
    price: 8500,
    discountPrice: 7900,
    status: "Published",
    isFeatured: true,
    isPopular: true,
    showPricing: true,
    allowAddOns: true,
    
    media: {
      thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200",
      banner: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1920",
      videoUrl: "",
      gallery: [
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1530103862676-de8892bf309c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=800"
      ]
    },

    features: [
      { id: 1, title: "Extensive Photography", description: "Two professional photographers ensuring comprehensive multi-angle coverage.", iconKey: "camera" },
      { id: 2, title: "Cinematic Film", description: "Two videographers capturing a premium 10-15 minute cinematic highlight film.", iconKey: "video" },
      { id: 3, title: "Aerial Perspectives", description: "Breathtaking drone shots of your venue and couple portraits.", iconKey: "drone" },
      { id: 4, title: "Premium Album", description: "A beautifully handcrafted 40-page flush-mount album.", iconKey: "album" }
    ],

    addOns: [
      { id: 4, name: "Same Day Edit", description: "A magical highlight video played at your reception.", price: 1200, iconKey: "film" },
      { id: 5, name: "Live Streaming", description: "Professional multi-camera live stream for remote guests.", price: 900, iconKey: "live" }
    ],

    offer: {
      title: "Wedding Season Special",
      type: "discount",
      description: "Get 15% off any add-ons when booked with the Gold Package.",
      badgeText: "15% OFF ADD-ONS"
    }
  },
  {
    id: "platinum-luxury",
    name: "Platinum Luxury Experience",
    category: "Wedding Photography",
    slug: "platinum-luxury",
    shortStory: "An uncompromising, full-scale production designed for the most exclusive and grand celebrations.",
    fullStory: "Experience the pinnacle of wedding cinematography and photography. A full production crew, state-of-the-art equipment, and priority white-glove editing ensure your wedding is captured like a Hollywood masterpiece.",
    price: 15000,
    discountPrice: null,
    status: "Published",
    isFeatured: true,
    isPopular: false,
    showPricing: false, // "Contact for Quote"
    allowAddOns: true,
    
    media: {
      thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
      banner: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=1920",
      videoUrl: "",
      gallery: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
      ]
    },

    features: [
      { id: 1, title: "Full Team Production", description: "A complete crew of 3 photographers and 3 cinematographers.", iconKey: "camera" },
      { id: 2, title: "Full Documentary Film", description: "A comprehensive 40-60 minute documentary edit of your entire celebration.", iconKey: "film" },
      { id: 3, title: "Priority Delivery", description: "Guaranteed 14-day turnaround for your complete gallery and teaser.", iconKey: "clock" },
      { id: 4, title: "Pre-Wedding Shoot", description: "Included luxury destination pre-wedding photo and video session.", iconKey: "travel" }
    ],

    addOns: [
      { id: 6, name: "Destination Coverage", description: "Fly our entire crew to your destination wedding anywhere in the world.", price: null, iconKey: "travel" }
    ],

    offer: {
      title: "Exclusive Upgrade",
      type: "free_product",
      description: "Complimentary parents' albums included with booking.",
      badgeText: "FREE ALBUMS"
    }
  },
  {
    id: "essential-pre-wedding",
    name: "Essential Pre-Wedding",
    category: "Pre-Wedding Shoot",
    slug: "essential-pre-wedding",
    shortStory: "A beautiful introductory session to capture your romance before the big day.",
    fullStory: "A focused session at a single beautiful location, designed to get you comfortable in front of the camera and provide stunning images for your save-the-dates.",
    price: 1500,
    discountPrice: null,
    status: "Published",
    isFeatured: false,
    isPopular: false,
    showPricing: true,
    allowAddOns: true,
    media: {
      thumbnail: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
      banner: null,
      videoUrl: "",
      gallery: []
    },
    features: [
      { id: 1, title: "1 Location Setup", description: "Choice of one premium outdoor or indoor location.", iconKey: "camera" },
      { id: 2, title: "25 Edited Photos", description: "Professionally retouched high-resolution images.", iconKey: "gallery" }
    ],
    addOns: [],
    offer: null
  },
  {
    id: "premium-pre-wedding",
    name: "Premium Pre-Wedding",
    category: "Pre-Wedding Shoot",
    slug: "premium-pre-wedding",
    shortStory: "A comprehensive cinematic experience across multiple breathtaking locations.",
    fullStory: "Tell your love story across multiple scenic backdrops. Includes outfit changes, drone coverage, and a cinematic reel perfect for social media and your wedding website.",
    price: 3500,
    discountPrice: 2999,
    status: "Published",
    isFeatured: true,
    isPopular: true,
    showPricing: true,
    allowAddOns: true,
    media: {
      thumbnail: "https://images.unsplash.com/photo-1583939008082-f7b764b88d4d?auto=format&fit=crop&q=80&w=1200",
      banner: null,
      videoUrl: "",
      gallery: []
    },
    features: [
      { id: 1, title: "Multiple Locations", description: "Up to 3 distinct locations over a full day shoot.", iconKey: "travel" },
      { id: 2, title: "Cinematic Reel", description: "A beautifully edited 1-minute video for social media.", iconKey: "video" },
      { id: 3, title: "Drone Shots", description: "Breathtaking aerial photography included.", iconKey: "drone" }
    ],
    addOns: [],
    offer: { badgeText: "Save $500" }
  },
  {
    id: "basic-couple",
    name: "Basic Couple Session",
    category: "Couple Shoot",
    slug: "basic-couple",
    shortStory: "A fun and casual 1-hour session to celebrate your relationship.",
    fullStory: "Perfect for anniversaries or just because. A relaxed, candid session capturing your authentic connection.",
    price: 500,
    discountPrice: null,
    status: "Published",
    isFeatured: false,
    isPopular: false,
    showPricing: true,
    allowAddOns: false,
    media: {
      thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200",
      banner: null,
      videoUrl: "",
      gallery: []
    },
    features: [
      { id: 1, title: "1 Hour Shoot", description: "Focused, fun, and fast-paced session.", iconKey: "camera" },
      { id: 2, title: "15 Edited Photos", description: "Delivered within 3 days via online gallery.", iconKey: "gallery" }
    ],
    addOns: [],
    offer: null
  }
];

export const getPackages = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DB);
    }, 500); // Simulate network latency
  });
};

export const getPackageById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const pkg = MOCK_DB.find(p => p.id === id || p.slug === id);
      if (pkg) {
        resolve(pkg);
      } else {
        reject(new Error("Package not found"));
      }
    }, 500);
  });
};

export const getCategoriesWithPackages = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. Filter only published packages
      const publishedPackages = MOCK_DB.filter(pkg => pkg.status === "Published");
      
      // 2. Group packages by category
      const grouped = publishedPackages.reduce((acc, pkg) => {
        if (!acc[pkg.category]) acc[pkg.category] = [];
        acc[pkg.category].push(pkg);
        return acc;
      }, {});

      // 3. Map to MOCK_CATEGORIES, filter out empty ones
      const categoriesWithPackages = MOCK_CATEGORIES.map(cat => ({
        ...cat,
        packages: grouped[cat.name] || []
      })).filter(cat => cat.packages.length > 0);

      // (Optional) If there are packages with categories not in MOCK_CATEGORIES, add them dynamically
      const knownCategoryNames = MOCK_CATEGORIES.map(c => c.name);
      Object.keys(grouped).forEach(catName => {
        if (!knownCategoryNames.includes(catName)) {
          categoriesWithPackages.push({
            id: catName.toLowerCase().replace(/\s+/g, '-'),
            name: catName,
            description: "Explore our premium packages in this category.",
            banner: null,
            packages: grouped[catName]
          });
        }
      });

      resolve(categoriesWithPackages);
    }, 600);
  });
};
