// ============================================================
// Balcony-to-Pantry Bulk-Buy Diversion Matrix — Data & Logic Engine
// ============================================================

// --- Types ---

export type StorageLocation = 'fridge' | 'freezer' | 'pantry' | 'counter';

export type ProduceCategory =
  | 'root veg'
  | 'allium'
  | 'fruit'
  | 'leafy'
  | 'squash'
  | 'nightshade'
  | 'cruciferous'
  | 'tropical';

export interface ProcessingMethod {
  id: string;
  name: string;
  description: string;
  storageLocation: StorageLocation;
  spaceNotes: string;
}

export interface BulkItem {
  id: string;
  name: string;
  emoji: string;
  category: ProduceCategory;
  /** Recommended diversion methods with weight ratios and details */
  diversions: BulkItemDiversions;
  /** Bulk buying tips for this item */
  tips: string[];
}

export interface BulkItemDiversions {
  /** Array of possible methods; the engine picks 2-4 based on total weight */
  methods: DiversionsMethod[];
}

export interface DiversionsMethod {
  methodId: string;
  /** Minimum weight in lbs for this method to be included */
  minWeightLbs: number;
  /** Priority — higher gets included first */
  priority: number;
  /** Space per pound after processing (human-readable) */
  spacePerLb: string;
  /** Cubic feet per pound after processing */
  cubicFtPerLb: number;
  /** Active processing time for 1 lb */
  processingTimePerLb: string;
  /** Passive processing time for 1 lb */
  passiveTimePerLb: string;
  /** Brief instructions template */
  instructions: string;
  /** Shelf life string */
  shelfLife: string;
}

export interface DiversionStep {
  method: ProcessingMethod;
  weightLbs: number;
  weightGrams: number;
  spaceUsed: string;
  storageLocation: StorageLocation;
  processingTime: string;
  instructions: string;
  shelfLife: string;
  /** Cubic feet this step occupies after processing */
  cubicFt: number;
}

export interface DiversionPlan {
  steps: DiversionStep[];
  totalWeightLbs: number;
  totalWeightGrams: number;
}

export interface SpaceFootprint {
  fridge: string;
  freezer: string;
  pantry: string;
  counter: string;
}

// --- Processing Methods Database ---

export const PROCESSING_METHODS: ProcessingMethod[] = [
  {
    id: 'lacto-ferment',
    name: 'Lacto-Ferment',
    description: 'Salt-brine fermentation for tangy, probiotic-rich results',
    storageLocation: 'fridge',
    spaceNotes: '1 pint mason jar',
  },
  {
    id: 'dehydrate',
    name: 'Dehydrate',
    description: 'Low-and-slow drying to concentrate flavor and shrink volume',
    storageLocation: 'pantry',
    spaceNotes: '½ spice jar',
  },
  {
    id: 'flash-freeze',
    name: 'Flash-Freeze',
    description: 'Spread on a sheet pan and freeze flat for easy stacking',
    storageLocation: 'freezer',
    spaceNotes: '1 freezer bag, laid flat',
  },
  {
    id: 'quick-pickle',
    name: 'Quick Pickle',
    description: 'Vinegar-brine pickling for bright, crunchy results',
    storageLocation: 'fridge',
    spaceNotes: '1 pint mason jar',
  },
  {
    id: 'roast-freeze',
    name: 'Roast & Freeze',
    description: 'Roast to concentrate flavor, then freeze in portions',
    storageLocation: 'freezer',
    spaceNotes: '1 freezer container',
  },
  {
    id: 'make-sauce',
    name: 'Make Sauce',
    description: 'Cook down into a versatile sauce or puree',
    storageLocation: 'freezer',
    spaceNotes: '1-2 freezer bags, laid flat',
  },
  {
    id: 'make-powder',
    name: 'Make Powder',
    description: 'Dehydrate fully then grind into a concentrated seasoning powder',
    storageLocation: 'pantry',
    spaceNotes: '¼ spice jar',
  },
  {
    id: 'blanch-freeze',
    name: 'Blanch & Freeze',
    description: 'Quick blanch to lock in color and nutrients, then freeze',
    storageLocation: 'freezer',
    spaceNotes: '1-2 freezer bags, laid flat',
  },
  {
    id: 'make-butter',
    name: 'Make Fruit Butter',
    description: 'Slow-cook into a rich, spreadable fruit butter',
    storageLocation: 'fridge',
    spaceNotes: '1-2 half-pint jars',
  },
  {
    id: 'make-jam',
    name: 'Make Jam',
    description: 'Cook with sugar and pectin into a shelf-stable jam',
    storageLocation: 'pantry',
    spaceNotes: '2-3 half-pint jars',
  },
  {
    id: 'make-chips',
    name: 'Make Chips',
    description: 'Slice thin and dehydrate into crispy snack chips',
    storageLocation: 'pantry',
    spaceNotes: '1 large zip-top bag',
  },
  {
    id: 'caramelize-freeze',
    name: 'Caramelize & Freeze',
    description: 'Slow-cook down into sweet, jammy caramelized pieces',
    storageLocation: 'freezer',
    spaceNotes: '1 freezer bag, laid flat',
  },
  {
    id: 'make-broth',
    name: 'Make Broth Base',
    description: 'Simmer into a concentrated broth or stock base',
    storageLocation: 'freezer',
    spaceNotes: '1 ice cube tray + 1 freezer bag',
  },
  {
    id: 'make-pesto',
    name: 'Make Pesto / Puree',
    description: 'Blend with oil and seasonings into a versatile puree',
    storageLocation: 'freezer',
    spaceNotes: '1-2 freezer bags, laid flat',
  },
  {
    id: 'store-cool-dark',
    name: 'Store Cool & Dark',
    description: 'Cure or store in a cool, dark, ventilated spot',
    storageLocation: 'counter',
    spaceNotes: '1 paper bag or basket',
  },
  {
    id: 'confit',
    name: 'Confit (Oil-Poach)',
    description: 'Slow-cook submerged in oil for silky, luxurious texture',
    storageLocation: 'fridge',
    spaceNotes: '1 pint jar (submerged in oil)',
  },
];

// --- Bulk Items Database ---

export const BULK_ITEMS: BulkItem[] = [
  {
    id: 'carrots',
    name: 'Carrots',
    emoji: '🥕',
    category: 'root veg',
    tips: [
      'Look for bulk carrot bags at farmers markets — often $0.50/lb or less.',
      'Remove tops immediately if present; they pull moisture from the roots.',
      'Don\'t peel before storing — the skin helps retain moisture during storage.',
      'Larger carrots are often cheaper per pound and easier to process in bulk.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'lacto-ferment',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '⅓ pint jar',
          cubicFtPerLb: 0.02,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '+ 5-7 days fermenting',
          instructions: 'Peel and cut into sticks. Pack into a pint mason jar with garlic, dill, and a few peppercorns. Pour 2% salt brine over top, ensuring carrots are submerged. Loosely cap and ferment at room temp for 5-7 days, then move to fridge.',
          shelfLife: '3-6 months in fridge',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '¼ cup powder',
          cubicFtPerLb: 0.005,
          processingTimePerLb: '~15 min prep + 8-10 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ⅛" rounds or grate. Dehydrate at 125°F until completely brittle (8-10 hrs). For powder, pulse in a blender until fine. Store in a spice jar in a dark cabinet.',
          shelfLife: '6-12 months in pantry',
        },
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 1,
          spacePerLb: '¼ freezer bag (flat)',
          cubicFtPerLb: 0.015,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '+ 2 hrs freezing',
          instructions: 'Peel and dice into ½" cubes. Blanch in boiling water for 2 min, then immediately transfer to an ice bath. Pat dry, spread on a parchment-lined sheet pan, and freeze solid. Transfer to a labeled freezer bag, press flat, and store.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-broth',
          minWeightLbs: 3,
          priority: 2,
          spacePerLb: '3-4 ice cubes',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~5 min prep + 45 min simmer',
          passiveTimePerLb: '',
          instructions: 'Use peels and trimmings (save the good parts for other methods). Simmer peels with onion, garlic, and bay leaf for 45 min. Strain, reduce by half, and freeze in ice cube trays. Pop out and store in a freezer bag.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'onions',
    name: 'Onions',
    emoji: '🧅',
    category: 'allium',
    tips: [
      'Buy 10-50 lb bags from warehouse clubs — yellow onions are cheapest.',
      'Store whole onions in a mesh bag in a cool, dark, ventilated space.',
      'Never store onions next to potatoes — they make each other spoil faster.',
      'Red onions are best for quick pickling; yellow are most versatile.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'caramelize-freeze',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '⅓ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~5 min prep + 45-60 min cook',
          passiveTimePerLb: '',
          instructions: 'Slice thinly. Cook in a large skillet with a little oil and a pinch of salt over medium-low heat, stirring occasionally, until deep golden and jammy (45-60 min). Cool, portion into freezer bags, press flat, and freeze.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '½ cup flakes',
          cubicFtPerLb: 0.006,
          processingTimePerLb: '~10 min prep + 6-8 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ⅛" rings or chop. Dehydrate at 125°F until completely crisp (6-8 hrs). For onion powder, grind dried flakes in a blender. Store in airtight jars in a dark cabinet.',
          shelfLife: '12+ months in pantry',
        },
        {
          methodId: 'quick-pickle',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '½ pint jar',
          cubicFtPerLb: 0.018,
          processingTimePerLb: '~10 min active + 10 min cooling',
          passiveTimePerLb: '',
          instructions: 'Slice into thin rings. Pack into a clean jar. Heat equal parts vinegar and water with salt, sugar, and spices until dissolved. Pour hot brine over onions, let cool, then refrigerate.',
          shelfLife: '2-4 weeks in fridge',
        },
        {
          methodId: 'make-pesto',
          minWeightLbs: 2,
          priority: 1,
          spacePerLb: '¼ freezer bag (flat)',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '',
          instructions: 'Roughly chop and blend with oil, a little vinegar, salt, and pepper until smooth. Portion into ice cube trays or freezer bags. Each cube is a flavor bomb for soups, stews, and sauces.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'garlic',
    name: 'Garlic',
    emoji: '🧄',
    category: 'allium',
    tips: [
      'Buy garlic in braids or 3-lb mesh bags for best pricing.',
      'Softneck garlic stores longer; hardneck has more flavor depth.',
      'Never refrigerate whole garlic — it sprouts faster in cold.',
      'A single head yields about 8-12 cloves, roughly 0.1 lbs.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'confit',
          minWeightLbs: 0.5,
          priority: 3,
          spacePerLb: '¾ pint jar',
          cubicFtPerLb: 0.025,
          processingTimePerLb: '~10 min prep + 45 min cook',
          passiveTimePerLb: '',
          instructions: 'Separate cloves (no need to peel). Submerge in olive oil in a small saucepan. Cook on the lowest heat for 40-45 min until cloves are soft and golden. Transfer cloves and oil to a clean jar, refrigerate.',
          shelfLife: '2-3 weeks in fridge (use the oil too!)',
        },
        {
          methodId: 'make-powder',
          minWeightLbs: 0.5,
          priority: 2,
          spacePerLb: '⅛ spice jar',
          cubicFtPerLb: 0.003,
          processingTimePerLb: '~10 min prep + 4-6 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Peel and slice cloves thinly. Dehydrate at 115°F until completely brittle (4-6 hrs). Grind in a blender or coffee grinder to a fine powder. Store in a tiny spice jar away from light.',
          shelfLife: '12+ months in pantry',
        },
        {
          methodId: 'lacto-ferment',
          minWeightLbs: 0.5,
          priority: 2,
          spacePerLb: '½ pint jar',
          cubicFtPerLb: 0.02,
          processingTimePerLb: '~5 min active + 7-14 days fermenting',
          passiveTimePerLb: '',
          instructions: 'Peel cloves and pack into a half-pint jar. Add a dried chili and a few peppercorns. Cover with 2% salt brine. Loosely cap and ferment 7-14 days at room temp. Move to fridge — they get mellower over time.',
          shelfLife: '6+ months in fridge',
        },
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 1,
          spacePerLb: '⅓ freezer bag',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~15 min active',
          passiveTimePerLb: '+ 1 hr freezing',
          instructions: 'Peel and mince or blend whole cloves with a little oil. Spoon into ice cube trays (about 1 head per tray). Freeze solid, then pop out into a freezer bag. Drop a cube directly into any dish.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'potatoes',
    name: 'Potatoes',
    emoji: '🥔',
    category: 'root veg',
    tips: [
      'Buy 20-50 lb bags from restaurant supply stores for huge savings.',
      'Store in a paper bag in a cool, dark place — never the fridge.',
      'Russets are best for freezing; waxy types hold up better for salads.',
      'If they sprout, just pluck the sprouts — they\'re still fine to eat.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 3,
          priority: 3,
          spacePerLb: '⅓ freezer bag (flat)',
          cubicFtPerLb: 0.015,
          processingTimePerLb: '~15 min active',
          passiveTimePerLb: '',
          instructions: 'Peel and cut into 1" cubes. Boil until just tender (8-10 min). Drain, spread on a parchment-lined sheet pan, and freeze until solid. Transfer to freezer bags, press flat, and store.',
          shelfLife: '10-12 months in freezer',
        },
        {
          methodId: 'make-chips',
          minWeightLbs: 2,
          priority: 2,
          spacePerLb: '½ large zip-top bag',
          cubicFtPerLb: 0.025,
          processingTimePerLb: '~15 min prep + 6-8 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice 1/16" thin (a mandoline works best). Soak in salted water for 10 min, pat very dry. Toss with a little oil and salt. Dehydrate at 135°F until completely crisp (6-8 hrs). Store in a zip-top bag.',
          shelfLife: '2-3 months in pantry',
        },
        {
          methodId: 'make-broth',
          minWeightLbs: 3,
          priority: 2,
          spacePerLb: '3-4 ice cubes',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~5 min prep + 30 min simmer',
          passiveTimePerLb: '',
          instructions: 'Use all peels and trimmings. Simmer with a bay leaf, peppercorns, and any aromatics for 30 min. Strain, reduce by half, and freeze in ice cube trays. Pop into freezer bags for long-term storage.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'roast-freeze',
          minWeightLbs: 2,
          priority: 1,
          spacePerLb: '⅓ freezer bag',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min prep + 35 min roasting',
          passiveTimePerLb: '',
          instructions: 'Cube into 1" pieces, toss with oil, salt, and rosemary. Roast at 400°F for 30-35 min until caramelized and tender. Cool completely, portion into freezer bags, and freeze.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'sweet-potatoes',
    name: 'Sweet Potatoes',
    emoji: '🍠',
    category: 'root veg',
    tips: [
      'Farmers market bulk deals in fall can be $0.75/lb or less.',
      'Cure them at room temp for 1-2 weeks before processing for best flavor.',
      'They\'re incredibly versatile — the same batch can become soup, fries, and puree.',
      'Store unprocessed sweet potatoes in a cool, dark, dry spot.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '⅓ freezer bag (flat)',
          cubicFtPerLb: 0.015,
          processingTimePerLb: '~15 min active',
          passiveTimePerLb: '',
          instructions: 'Peel and cube into 1" pieces. Steam or boil until fork-tender. Mash or leave in cubes. Spread on a parchment sheet, freeze solid, then transfer to labeled freezer bags.',
          shelfLife: '10-12 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '¼ cup chips',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~15 min prep + 8-12 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ⅛" rounds. Blanch for 3 min, then plunge into ice water. Pat dry, arrange on dehydrator trays. Dehydrate at 125°F until leathery-crisp (8-12 hrs). Great for snacking.',
          shelfLife: '6-12 months in pantry',
        },
        {
          methodId: 'roast-freeze',
          minWeightLbs: 2,
          priority: 2,
          spacePerLb: '⅓ freezer bag',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min prep + 30 min roasting',
          passiveTimePerLb: '',
          instructions: 'Cube into 1" pieces. Toss with oil, cinnamon, and a pinch of salt. Roast at 400°F for 25-30 min until caramelized edges form. Cool, portion into freezer bags, and freeze.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'make-sauce',
          minWeightLbs: 3,
          priority: 1,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~10 min prep + 20 min cook',
          passiveTimePerLb: '',
          instructions: 'Roast whole at 400°F until very soft (45 min). Scoop out flesh, blend with a splash of broth, maple syrup, and spices. Portion into freezer bags, press flat, and freeze. Perfect for quick soups or baby food.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'apples',
    name: 'Apples',
    emoji: '🍎',
    category: 'fruit',
    tips: [
      'Orchard seconds (cosmetic imperfections) are perfect for processing — often half price.',
      'Mix varieties for the best flavor — tart + sweet is the golden ratio.',
      'One peck (~10 lbs) makes about 4-5 pints of applesauce.',
      'Use a peeler-corer-slicer tool to speed up processing dramatically.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'make-butter',
          minWeightLbs: 3,
          priority: 3,
          spacePerLb: '½ half-pint jar',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~15 min prep + 2-3 hrs slow cook',
          passiveTimePerLb: '',
          instructions: 'Core and roughly chop (no need to peel). Cook down in a slow cooker or low pot with cinnamon and a splash of apple cider vinegar for 2-3 hrs until dark and spreadable. Blend smooth if desired. Jar and refrigerate.',
          shelfLife: '2-3 weeks in fridge, 3 months frozen',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '½ cup chips',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~15 min prep + 6-8 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Core and slice into ⅛" rings (leave skin on). Soak in lemon water for 5 min to prevent browning. Dehydrate at 135°F until leathery (6-8 hrs). Store in an airtight jar.',
          shelfLife: '6-12 months in pantry',
        },
        {
          methodId: 'make-sauce',
          minWeightLbs: 3,
          priority: 2,
          spacePerLb: '¾ freezer bag (flat)',
          cubicFtPerLb: 0.015,
          processingTimePerLb: '~15 min prep + 20 min cook',
          passiveTimePerLb: '',
          instructions: 'Peel, core, and chop. Cook with a splash of water and cinnamon until very soft (15-20 min). Blend smooth. Portion into freezer bags, press flat, and freeze. Great for oatmeal, baking, or eating by the spoonful.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 1,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min active + 1 hr freezing',
          passiveTimePerLb: '',
          instructions: 'Peel, core, and slice or dice. Toss with a little lemon juice to prevent browning. Spread in a single layer on a parchment-lined sheet pan. Freeze solid, then transfer to freezer bags.',
          shelfLife: '8-12 months in freezer',
        },
      ],
    },
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    emoji: '🍓',
    category: 'fruit',
    tips: [
      'U-pick farms in season are the cheapest — often $2-3/lb.',
      'Process within 24 hours; they mold fast at room temperature.',
      'Don\'t wash until you\'re ready to process — moisture speeds spoilage.',
      'Flash-freezing is the #1 method for strawberries in apartment settings.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 3,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '+ 2 hrs freezing',
          instructions: 'Hull and slice in half. Spread cut-side down on a parchment-lined sheet pan. Freeze until solid (2+ hrs). Transfer to freezer bags, press flat, and store. Use straight from frozen for smoothies.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-jam',
          minWeightLbs: 2,
          priority: 2,
          spacePerLb: '1 half-pint jar',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~15 min prep + 20 min cook',
          passiveTimePerLb: '',
          instructions: 'Hull and mash with a potato masher. Combine with sugar and lemon juice in a wide pot. Boil, stirring frequently, until it reaches 220°F (20-25 min). Ladle into sterilized jars and seal.',
          shelfLife: '1 year in pantry (sealed), 3 weeks in fridge (open)',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '¼ cup dried',
          cubicFtPerLb: 0.006,
          processingTimePerLb: '~10 min prep + 8-12 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Hull and slice into ¼" thick pieces. Dehydrate at 135°F until leathery with no moisture in the center (8-12 hrs). They\'ll be intensely flavored — perfect for granola, trail mix, or tea.',
          shelfLife: '6-12 months in pantry',
        },
        {
          methodId: 'make-sauce',
          minWeightLbs: 3,
          priority: 1,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~10 min prep + 15 min cook',
          passiveTimePerLb: '',
          instructions: 'Hull and cook down with a little sugar and balsamic vinegar until thick and jammy (15 min). Blend if desired. Portion into freezer bags, press flat, and freeze. Incredible on pancakes, yogurt, or ice cream.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'peaches',
    name: 'Peaches',
    emoji: '🍑',
    category: 'fruit',
    tips: [
      'Buy "freestone" varieties — pits pop out easily, saving tons of time.',
      'Farmers market "seconds" are ideal — they\'ll be cooked or frozen anyway.',
      'Blanching for 30 seconds makes peeling effortless.',
      'Peak season is July-August — buy in bulk then and freeze for winter.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~15 min active',
          passiveTimePerLb: '+ 2 hrs freezing',
          instructions: 'Blanch 30 sec, ice bath, peel, slice. Toss with lemon juice. Spread on a parchment sheet in a single layer. Freeze solid, transfer to freezer bags, press flat. Use for smoothies, cobblers, or oatmeal.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-butter',
          minWeightLbs: 3,
          priority: 2,
          spacePerLb: '½ half-pint jar',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~15 min prep + 2-3 hrs slow cook',
          passiveTimePerLb: '',
          instructions: 'Peel, pit, and chop. Cook in a slow cooker or low pot with a splash of water and vanilla for 2-3 hrs until dark and spreadable. Blend smooth. Jar and refrigerate or freeze.',
          shelfLife: '3 weeks in fridge, 6 months frozen',
        },
        {
          methodId: 'make-jam',
          minWeightLbs: 3,
          priority: 2,
          spacePerLb: '1 half-pint jar',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~15 min prep + 25 min cook',
          passiveTimePerLb: '',
          instructions: 'Peel, pit, and chop. Combine with sugar and lemon juice. Boil until it reaches gel stage (220°F), stirring often. Ladle into sterilized jars. The flavor of homemade peach jam is incomparable.',
          shelfLife: '1 year in pantry (sealed), 3 weeks fridge (open)',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 1,
          spacePerLb: '⅓ cup dried',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~10 min prep + 10-14 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ¼" wedges. Dip in lemon water. Dehydrate at 135°F until leathery and pliable (10-14 hrs). They make incredible snack chips — intensely sweet and chewy.',
          shelfLife: '6-12 months in pantry',
        },
      ],
    },
  },
  {
    id: 'tomatoes',
    name: 'Tomatoes',
    emoji: '🍅',
    category: 'nightshade',
    tips: [
      'Late summer "u-pick" or farmers market "box deals" are the sweet spot for pricing.',
      'Roma/plum tomatoes have less water — more bang for your buck in sauces.',
      'Don\'t refrigerate whole tomatoes — it kills the flavor and texture.',
      'Freezing tomatoes whole (no blanching needed) is the fastest method of all.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'make-sauce',
          minWeightLbs: 3,
          priority: 3,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min prep + 30-45 min cook',
          passiveTimePerLb: '',
          instructions: 'Core and quarter (no need to peel). Simmer with garlic, olive oil, and salt until reduced by half (30-45 min). Blend smooth or leave chunky. Portion into freezer bags, press flat, and freeze.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'roast-freeze',
          minWeightLbs: 2,
          priority: 2,
          spacePerLb: '⅓ freezer bag',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min prep + 40 min roasting',
          passiveTimePerLb: '',
          instructions: 'Halve and place cut-side up on a sheet pan. Drizzle with olive oil, salt, and herbs. Roast at 400°F for 35-40 min until blistered and caramelized. Cool, transfer to freezer bags in portions.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 2,
          priority: 2,
          spacePerLb: '¼ cup dried',
          cubicFtPerLb: 0.005,
          processingTimePerLb: '~10 min prep + 10-14 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice Roma tomatoes into ¼" rounds. Arrange on dehydrator trays. Dehydrate at 135°F until leathery (10-14 hrs). Store in a jar with a little olive oil, or powder them for tomato seasoning.',
          shelfLife: '12+ months (dried), 6 months (in oil, in fridge)',
        },
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 1,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.015,
          processingTimePerLb: '~5 min active',
          passiveTimePerLb: '+ 2 hrs freezing',
          instructions: 'The laziest method: wash, core, and throw whole on a sheet pan. Freeze solid. Transfer to freezer bags. When you thaw, the skins slip right off. Perfect for soups and stews.',
          shelfLife: '8-12 months in freezer',
        },
      ],
    },
  },
  {
    id: 'bell-peppers',
    name: 'Bell Peppers',
    emoji: '🫑',
    category: 'nightshade',
    tips: [
      'Buy mixed color packs in season — red, yellow, and orange are sweetest.',
      'End-of-season farmers market deals can be as low as $0.50/lb.',
      'Freezing is the #1 method — they retain their texture perfectly.',
      'Don\'t bother canning peppers; freezing is easier and tastes better.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '⅓ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '+ 2 hrs freezing',
          instructions: 'Core, seed, and slice into strips or dice. Spread on a parchment-lined sheet pan (no blanching needed for peppers). Freeze until solid. Transfer to freezer bags, press flat.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'roast-freeze',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '¼ freezer bag',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~5 min prep + 30 min roasting',
          passiveTimePerLb: '',
          instructions: 'Place whole peppers directly on a gas flame or under a broiler. Char on all sides until blackened (10-15 min). Steam in a bag for 10 min, peel, and freeze in portions.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '⅓ cup flakes',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~10 min prep + 8-10 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ¼" strips or dice. Dehydrate at 125°F until brittle (8-10 hrs). Grind into pepper powder or store as flakes. Rehydrate in hot water or add directly to soups.',
          shelfLife: '12+ months in pantry',
        },
        {
          methodId: 'quick-pickle',
          minWeightLbs: 1,
          priority: 1,
          spacePerLb: '½ pint jar',
          cubicFtPerLb: 0.018,
          processingTimePerLb: '~10 min active + 10 min cooling',
          passiveTimePerLb: '',
          instructions: 'Slice into strips or rings. Pack into jars with garlic and a few whole spices. Pour hot vinegar-water-sugar-salt brine over top. Cool, then refrigerate. Crunchy and brightly flavored.',
          shelfLife: '2-3 weeks in fridge',
        },
      ],
    },
  },
  {
    id: 'jalapenos',
    name: 'Jalapeños',
    emoji: '🌶️',
    category: 'nightshade',
    tips: [
      'A 5 lb box at Mexican markets is often $3-5.',
      'Wear gloves when processing — capsaicin oil lingers on fingers.',
      'Remove seeds and membranes for milder heat, leave them for maximum fire.',
      'Jalapeños freeze beautifully and are the easiest pepper to preserve.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 3,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '+ 1 hr freezing',
          instructions: 'Wash and stem. Slice into rings or leave whole. Spread on a parchment sheet. Freeze solid, transfer to freezer bags. Use straight from frozen — they thaw in minutes in hot dishes.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'quick-pickle',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '½ pint jar',
          cubicFtPerLb: 0.018,
          processingTimePerLb: '~10 min active + 10 min cooling',
          passiveTimePerLb: '',
          instructions: 'Slice into rings. Pack into jars with garlic, oregano, and carrot slices. Pour hot vinegar-water-salt brine over top. These are the jalapeños you get at taco trucks — infinitely better than store-bought.',
          shelfLife: '2-3 months in fridge',
        },
        {
          methodId: 'make-powder',
          minWeightLbs: 0.5,
          priority: 2,
          spacePerLb: '¼ spice jar',
          cubicFtPerLb: 0.004,
          processingTimePerLb: '~10 min prep + 8-10 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ⅛" rounds (wear gloves!). Dehydrate at 125°F until completely brittle (8-10 hrs). Grind into powder — this is your homemade chili powder base. Insanely flavorful compared to store-bought.',
          shelfLife: '12+ months in pantry',
        },
        {
          methodId: 'make-sauce',
          minWeightLbs: 1,
          priority: 1,
          spacePerLb: '½ half-pint jar',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~15 min prep + 15 min cook',
          passiveTimePerLb: '',
          instructions: 'Simmer with garlic, onion, a little vinegar, and salt until very soft. Blend smooth. Adjust heat with more or fewer seeds. Bottle and refrigerate — it\'s a condiment you\'ll use on everything.',
          shelfLife: '2-3 months in fridge',
        },
      ],
    },
  },
  {
    id: 'bananas',
    name: 'Bananas',
    emoji: '🍌',
    category: 'tropical',
    tips: [
      'Buy the "ripe and ready" clearance bin — they\'re perfect for freezing.',
      'A typical bunch is 1.5-2 lbs; case quantities are 20-40 lbs.',
      'Peel before freezing — frozen peels are impossible to remove.',
      'Freeze in specific portion sizes (1-2 bananas per bag) for easy smoothies.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 3,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~5 min active',
          passiveTimePerLb: '+ 2 hrs freezing',
          instructions: 'Peel and slice into rounds. Spread on a parchment sheet in a single layer. Freeze solid. Transfer to freezer bags in 1-banana portions. Perfect for smoothies, banana bread, or nice cream.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '⅓ cup chips',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~10 min prep + 6-8 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into ¼" rounds. Dip in lemon juice to prevent browning. Dehydrate at 130°F until leathery-crisp (6-8 hrs). Dust with cinnamon if desired. Better than any store-bought banana chip.',
          shelfLife: '6-12 months in pantry',
        },
        {
          methodId: 'make-butter',
          minWeightLbs: 3,
          priority: 2,
          spacePerLb: '½ half-pint jar',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~5 min prep + 2-3 hrs slow cook',
          passiveTimePerLb: '',
          instructions: 'Peel overripe bananas. Mash and cook in a slow cooker or low pot with a splash of lemon juice and vanilla for 2-3 hrs until dark and spreadable. Stir occasionally. Jar and refrigerate.',
          shelfLife: '3 weeks in fridge, 6 months frozen',
        },
        {
          methodId: 'make-sauce',
          minWeightLbs: 2,
          priority: 1,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~5 min prep + 10 min cook',
          passiveTimePerLb: '',
          instructions: 'Peel very ripe bananas. Blend until smooth with a squeeze of lime juice. Portion into freezer bags, press flat, and freeze. Great for baking, pancakes, or as a natural sweetener in smoothies.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'zucchini',
    name: 'Zucchini',
    emoji: '🥒',
    category: 'squash',
    tips: [
      'In late summer, people literally give zucchini away — take them all.',
      'Shred and freeze for baking — it\'s the most space-efficient method.',
      'Large overgrown zucchini are perfect for shredding; small ones are better for slicing.',
      'Zucchini is 95% water — dehydrating yields surprisingly tiny amounts.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '⅓ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~15 min active',
          passiveTimePerLb: '',
          instructions: 'For baking: shred on a box grater. Squeeze out excess moisture (save the juice for soup!). Portion into 2-cup freezer bags, press flat. For soups: dice and blanch 2 min before freezing.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-chips',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '¼ cup chips',
          cubicFtPerLb: 0.006,
          processingTimePerLb: '~10 min prep + 8-10 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Slice into 1/16" rounds on a mandoline. Salt for 15 min, rinse and pat very dry. Toss with a tiny bit of oil and seasoning. Dehydrate at 135°F until crispy (8-10 hrs). Delicate but delicious.',
          shelfLife: '2-3 months in pantry',
        },
        {
          methodId: 'lacto-ferment',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '½ pint jar',
          cubicFtPerLb: 0.018,
          processingTimePerLb: '~10 min active + 5-7 days fermenting',
          passiveTimePerLb: '',
          instructions: 'Slice into spears. Pack into a jar with dill, garlic, and mustard seeds. Pour 2% salt brine over top. Ferment at room temp 5-7 days. They stay satisfyingly crunchy — way better than cucumber pickles.',
          shelfLife: '3-6 months in fridge',
        },
        {
          methodId: 'make-pesto',
          minWeightLbs: 2,
          priority: 1,
          spacePerLb: '½ freezer bag (flat)',
          cubicFtPerLb: 0.01,
          processingTimePerLb: '~10 min prep',
          passiveTimePerLb: '',
          instructions: 'Roughly chop and sauté with garlic and onion until soft. Blend into a smooth puree with basil or herbs and olive oil. Portion into freezer bags, press flat. Add to pasta sauces, soups, or spread on toast.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    emoji: '🥬',
    category: 'cruciferous',
    tips: [
      'Whole heads are incredibly cheap — often $0.50-1.00 each (2-3 lbs).',
      'Green cabbage is cheapest; red and savoy have more nutrients.',
      'A food processor with a shredding disk makes bulk prep trivial.',
      'Sauerkraut is the most forgiving fermentation project for beginners.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'lacto-ferment',
          minWeightLbs: 2,
          priority: 3,
          spacePerLb: '⅓ pint jar',
          cubicFtPerLb: 0.018,
          processingTimePerLb: '~10 min active + 1-4 weeks fermenting',
          passiveTimePerLb: '',
          instructions: 'Shred finely with a knife or mandoline. Mass with 2% salt by weight until brine forms. Pack tightly into a jar, pressing until the cabbage is submerged in its own brine. Ferment 1-4 weeks to taste. This is sauerkraut.',
          shelfLife: '6+ months in fridge',
        },
        {
          methodId: 'quick-pickle',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '½ pint jar',
          cubicFtPerLb: 0.018,
          processingTimePerLb: '~10 min active + 10 min cooling',
          passiveTimePerLb: '',
          instructions: 'Slice thin or shred. Pack into jars. Pour hot brine of vinegar, water, sugar, salt, celery seed, and mustard seed over top. Cool and refrigerate. Crunchy, tangy slaw in a jar.',
          shelfLife: '3-4 weeks in fridge',
        },
        {
          methodId: 'flash-freeze',
          minWeightLbs: 2,
          priority: 2,
          spacePerLb: '⅓ freezer bag (flat)',
          cubicFtPerLb: 0.012,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '',
          instructions: 'Shred or wedge. Blanch shreds for 1.5 min, wedges for 3 min. Immediately ice bath, drain, pat dry. Spread on a sheet pan, freeze solid, transfer to freezer bags. Great for soups and stir-fries.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-broth',
          minWeightLbs: 3,
          priority: 1,
          spacePerLb: '3-4 ice cubes',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~5 min prep + 30 min simmer',
          passiveTimePerLb: '',
          instructions: 'Use outer leaves and cores. Simmer with onion, carrot, and bay leaf for 30 min. Strain and reduce by half. Freeze in ice cube trays for instant flavor bombs in soups, stews, and braises.',
          shelfLife: '6 months in freezer',
        },
      ],
    },
  },
  {
    id: 'kale',
    name: 'Kale',
    emoji: '🥗',
    category: 'leafy',
    tips: [
      'Buy bunches or a 1 lb bag — a 1 lb bag of kale is already stemmed and washed.',
      'After the first frost, kale gets sweeter — the best time to buy in bulk.',
      'Strip leaves from stems before processing — stems are woody and bitter.',
      'Massage raw kale with oil and salt before freezing for better texture later.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 3,
          spacePerLb: '¼ freezer bag (flat)',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '',
          instructions: 'Strip leaves from stems, tear into pieces. Blanch for 30 sec in boiling water, immediately ice bath. Squeeze out as much water as possible. Form into tight balls, freeze on a sheet pan, then bag.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-chips',
          minWeightLbs: 0.5,
          priority: 2,
          spacePerLb: '1 large zip-top bag',
          cubicFtPerLb: 0.025,
          processingTimePerLb: '~10 min prep + 15-20 min baking',
          passiveTimePerLb: '',
          instructions: 'Strip leaves, tear into large pieces. Massage with olive oil and salt until soft and bright green. Spread in a single layer on sheet pans. Bake at 275°F for 15-20 min, rotating pans halfway. Watch closely — they go from perfect to burnt fast.',
          shelfLife: '1-2 weeks in pantry (store with a silica packet)',
        },
        {
          methodId: 'make-pesto',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '¼ freezer bag (flat)',
          cubicFtPerLb: 0.008,
          processingTimePerLb: '~10 min prep',
          passiveTimePerLb: '',
          instructions: 'Blanch leaves 30 sec, ice bath, squeeze dry. Blend with garlic, nuts, parmesan, and olive oil into a thick pesto. Portion into ice cube trays or freezer bags. Each cube flavors a bowl of pasta or a soup.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 0.5,
          priority: 1,
          spacePerLb: '1 spice jar',
          cubicFtPerLb: 0.005,
          processingTimePerLb: '~5 min prep + 4-6 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Strip leaves from stems. Dehydrate at 115°F until completely crispy (4-6 hrs). Crumble or powder in your hands. Sprinkle on everything — eggs, popcorn, pasta, soups — as a nutrient-dense seasoning.',
          shelfLife: '12+ months in pantry',
        },
      ],
    },
  },
  {
    id: 'spinach',
    name: 'Spinach',
    emoji: '🥬',
    category: 'leafy',
    tips: [
      'A 5 lb clamshell box from wholesale clubs is about $5-7.',
      'Spinach cooks down to about 1/10 of its raw volume — a 5 lb box becomes ~0.5 lb cooked.',
      'Don\'t wash before freezing if buying pre-washed — skip that step entirely.',
      'The fastest bulk method: blend and freeze in ice cube trays.',
    ],
    diversions: {
      methods: [
        {
          methodId: 'flash-freeze',
          minWeightLbs: 1,
          priority: 3,
          spacePerLb: '⅕ freezer bag (flat)',
          cubicFtPerLb: 0.006,
          processingTimePerLb: '~10 min active',
          passiveTimePerLb: '',
          instructions: 'Wash if needed, but don\'t dry. Steam in a large pot with just the water clinging to the leaves until wilted (2-3 min). Squeeze out ALL water. Form into balls (about 1 cup raw per ball). Freeze on a sheet pan, then bag.',
          shelfLife: '8-12 months in freezer',
        },
        {
          methodId: 'make-pesto',
          minWeightLbs: 1,
          priority: 2,
          spacePerLb: '⅕ freezer bag (flat)',
          cubicFtPerLb: 0.006,
          processingTimePerLb: '~5 min prep',
          passiveTimePerLb: '',
          instructions: 'The fastest method: pack raw spinach into a blender with garlic, olive oil, and parmesan. Blend into a thick green paste. Portion into ice cube trays. Freeze and bag. Each cube is a vitamin bomb.',
          shelfLife: '6 months in freezer',
        },
        {
          methodId: 'dehydrate',
          minWeightLbs: 0.5,
          priority: 2,
          spacePerLb: '½ spice jar',
          cubicFtPerLb: 0.004,
          processingTimePerLb: '~5 min prep + 4-6 hrs dehydrator',
          passiveTimePerLb: '',
          instructions: 'Spread leaves on dehydrator trays (no need to dry first). Dehydrate at 110°F until completely crispy (4-6 hrs). Crumble into flakes. Add to smoothies, soups, eggs, or pasta for a hidden nutrition boost.',
          shelfLife: '12+ months in pantry',
        },
      ],
    },
  },
];

// --- Space Calculation Helpers ---

function getMethod(methodId: string): ProcessingMethod | undefined {
  return PROCESSING_METHODS.find((m) => m.id === methodId);
}

/**
 * Calculate total space footprint grouped by storage location.
 */
export function calculateTotalSpaceFootprint(
  plan: DiversionPlan
): SpaceFootprint {
  const locations: Record<StorageLocation, string[]> = {
    fridge: [],
    freezer: [],
    pantry: [],
    counter: [],
  };

  for (const step of plan.steps) {
    locations[step.storageLocation].push(step.spaceUsed);
  }

  const formatList = (items: string[]) => {
    if (items.length === 0) return 'None';
    // Simplify: if many identical items, combine
    const counts: Record<string, number> = {};
    for (const item of items) {
      counts[item] = (counts[item] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([item, count]) => (count > 1 ? `${count}× ${item}` : item))
      .join(', ');
  };

  return {
    fridge: formatList(locations.fridge),
    freezer: formatList(locations.freezer),
    pantry: formatList(locations.pantry),
    counter: formatList(locations.counter),
  };
}

/**
 * Format total space in cubic feet.
 */
export function formatSpaceCubicFeet(plan: DiversionPlan): string {
  const totalCubicFt = plan.steps.reduce((sum, step) => sum + step.cubicFt, 0);
  return `${totalCubicFt.toFixed(2)} cubic feet`;
}

// --- Plan Generation ---

/**
 * Generate a diversion plan for a given bulk item and total weight.
 */
export function generateDiversionPlan(
  item: BulkItem,
  totalLbs: number
): DiversionPlan {
  const totalGrams = Math.round(totalLbs * 453.592);

  // Get eligible methods sorted by priority (highest first)
  const eligible = item.diversions.methods
    .filter((d) => totalLbs >= d.minWeightLbs)
    .sort((a, b) => b.priority - a.priority);

  // We want 2-4 methods. For very small amounts (< 2 lbs), use fewer.
  const targetCount = totalLbs < 2 ? 2 : totalLbs < 5 ? 3 : Math.min(eligible.length, 4);
  const selectedMethods = eligible.slice(0, targetCount);

  // Allocate weight proportions based on priority
  // Higher priority gets a bigger share
  const totalPriority = selectedMethods.reduce((sum, m) => sum + m.priority, 0);
  let allocatedLbs = 0;

  const steps: DiversionStep[] = selectedMethods.map((dm, i) => {
    const method = getMethod(dm.methodId);
    if (!method) {
      return null;
    }

    let weightLbs: number;
    if (i === selectedMethods.length - 1) {
      // Last method gets the remainder
      weightLbs = Math.round((totalLbs - allocatedLbs) * 100) / 100;
    } else {
      // Proportional allocation based on priority
      const share = dm.priority / totalPriority;
      weightLbs = Math.round(share * totalLbs * 100) / 100;
      // Ensure at least the minimum weight
      weightLbs = Math.max(weightLbs, dm.minWeightLbs);
    }

    allocatedLbs += weightLbs;
    const weightGrams = Math.round(weightLbs * 453.592);

    const spaceUsed = calculateSpaceUsed(weightLbs, dm.spacePerLb);
    const cubicFt = Math.round(weightLbs * dm.cubicFtPerLb * 1000) / 1000;
    const processingTime = dm.processingTimePerLb + (dm.passiveTimePerLb ? ` ${dm.passiveTimePerLb}` : '');

    return {
      method,
      weightLbs,
      weightGrams,
      spaceUsed,
      storageLocation: method.storageLocation,
      processingTime,
      instructions: dm.instructions,
      shelfLife: dm.shelfLife,
      cubicFt,
    };
  }).filter(Boolean) as DiversionStep[];

  // Fix rounding: adjust last step so weights sum exactly to totalLbs
  if (steps.length > 0) {
    const currentSum = steps.reduce((s, step) => s + step.weightLbs, 0);
    const diff = Math.round((totalLbs - currentSum) * 100) / 100;
    const last = steps[steps.length - 1];
    last.weightLbs = Math.round((last.weightLbs + diff) * 100) / 100;
    last.weightGrams = Math.round(last.weightLbs * 453.592);
  }

  return {
    steps,
    totalWeightLbs: totalLbs,
    totalWeightGrams: Math.round(totalLbs * 453.592),
  };
}

function calculateSpaceUsed(weightLbs: number, spacePerLb: string): string {
  if (weightLbs <= 1) return spacePerLb;

  // For fractional units, try to combine
  // Simple approach: if weight is whole number, prefix with count
  if (Number.isInteger(weightLbs)) {
    return `${Math.round(weightLbs)}× ${spacePerLb}`;
  }
  // For fractional weights, approximate
  const wholePart = Math.floor(weightLbs);
  if (wholePart >= 2) {
    return `~${Math.round(weightLbs)}× ${spacePerLb}`;
  }
  return spacePerLb;
}
