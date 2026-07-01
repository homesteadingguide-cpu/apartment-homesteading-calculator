// ============================================================
// Balcony-to-Pantry Preserving Calculator — Data & Logic Engine
// ============================================================

// --- Types ---
export type PreservingMethod = "quick-pickle" | "ferment" | "water-bath";

export interface ProduceItem {
  id: string;
  name: string;
  emoji: string;
  quickPickle: boolean;
  ferment: boolean;
  waterBath: boolean;
  // Vinegar note for quick pickle
  defaultVinegar: "white" | "apple-cider" | "rice";
  // Water-bath: is it high-acid enough for safe water-bath?
  waterBathAcidified: boolean; // needs added acid (lemon juice / vinegar)
  waterBathProcessingMinutes: number; // per pint jar
  // Flavor suggestions
  flavorPairings: string[];
  // Jar size recommendation
  defaultJarSize: "half-pint" | "pint";
}

export interface HarvestEntry {
  produceId: string;
  weightGrams: number;
}

export interface RecipeOutput {
  title: string;
  method: PreservingMethod;
  jarSize: "half-pint" | "pint";
  jarSizeMl: number;
  servings: number;
  ingredients: RecipeIngredient[];
  equipment: string[];
  steps: string[];
  storage: string;
  shelfLife: string;
  safetyNote: string;
  totalWeightGrams: number;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  amountGrams?: number;
  amountMl?: number;
  note?: string;
}

// --- Produce Database ---
export const PRODUCE: ProduceItem[] = [
  {
    id: "jalapeno",
    name: "Jalapeños",
    emoji: "🌶️",
    quickPickle: true,
    ferment: true,
    waterBath: false,
    defaultVinegar: "apple-cider",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 0,
    flavorPairings: ["garlic", "onion", "carrot", "oregano", "cumin"],
    defaultJarSize: "half-pint",
  },
  {
    id: "carrot",
    name: "Carrots",
    emoji: "🥕",
    quickPickle: true,
    ferment: true,
    waterBath: false,
    defaultVinegar: "rice",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 0,
    flavorPairings: ["ginger", "garlic", "dill", "chili flake", "coriander"],
    defaultJarSize: "pint",
  },
  {
    id: "onion",
    name: "Onions (Red)",
    emoji: "🧅",
    quickPickle: true,
    ferment: true,
    waterBath: false,
    defaultVinegar: "apple-cider",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 0,
    flavorPairings: ["peppercorn", "bay leaf", "thyme", "garlic"],
    defaultJarSize: "half-pint",
  },
  {
    id: "cherry-tomato",
    name: "Cherry Tomatoes",
    emoji: "🍅",
    quickPickle: true,
    ferment: true,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: true,
    waterBathProcessingMinutes: 40,
    flavorPairings: ["basil", "garlic", "oregano", "chili flake"],
    defaultJarSize: "half-pint",
  },
  {
    id: "cucumber",
    name: "Cucumbers (Small)",
    emoji: "🥒",
    quickPickle: true,
    ferment: true,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 10,
    flavorPairings: ["dill", "garlic", "mustard seed", "peppercorn", "bay leaf"],
    defaultJarSize: "pint",
  },
  {
    id: "radish",
    name: "Radishes",
    emoji: "🫑",
    quickPickle: true,
    ferment: true,
    waterBath: false,
    defaultVinegar: "rice",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 0,
    flavorPairings: ["ginger", "garlic", "chili", "cilantro"],
    defaultJarSize: "half-pint",
  },
  {
    id: "green-bean",
    name: "Green Beans",
    emoji: "🫘",
    quickPickle: true,
    ferment: true,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 5,
    flavorPairings: ["garlic", "dill", "mustard seed", "chili flake"],
    defaultJarSize: "pint",
  },
  {
    id: "strawberry",
    name: "Strawberries",
    emoji: "🍓",
    quickPickle: false,
    ferment: false,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 10,
    flavorPairings: ["lemon", "vanilla", "balsamic", "black pepper"],
    defaultJarSize: "half-pint",
  },
  {
    id: "peach",
    name: "Peaches",
    emoji: "🍑",
    quickPickle: false,
    ferment: false,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: true,
    waterBathProcessingMinutes: 25,
    flavorPairings: ["cinnamon", "ginger", "vanilla", "cloves", "bourbon"],
    defaultJarSize: "pint",
  },
  {
    id: "bell-pepper",
    name: "Bell Peppers",
    emoji: "🫑",
    quickPickle: true,
    ferment: true,
    waterBath: true,
    defaultVinegar: "apple-cider",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 15,
    flavorPairings: ["garlic", "onion", "oregano", "bay leaf"],
    defaultJarSize: "pint",
  },
  {
    id: "garlic",
    name: "Garlic Cloves",
    emoji: "🧄",
    quickPickle: true,
    ferment: true,
    waterBath: false,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 0,
    flavorPairings: ["chili flake", "thyme", "bay leaf", "peppercorn"],
    defaultJarSize: "half-pint",
  },
  {
    id: "cauliflower",
    name: "Cauliflower Florets",
    emoji: "🥦",
    quickPickle: true,
    ferment: true,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 15,
    flavorPairings: ["turmeric", "garlic", "chili flake", "coriander", "mustard seed"],
    defaultJarSize: "pint",
  },
];

// --- Helper Functions ---
function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function getJarMl(size: "half-pint" | "pint"): number {
  return size === "half-pint" ? 237 : 473;
}

function formatGrams(g: number): string {
  if (g >= 1000) return `${roundTo(g / 1000, 1)} kg`;
  return `${roundTo(g, 0)} g`;
}

function formatMl(ml: number): string {
  if (ml >= 1000) return `${roundTo(ml / 1000, 1)} L`;
  if (ml < 1) return `${roundTo(ml * 1000, 0)} ml`;
  return `${roundTo(ml, 0)} ml`;
}

function formatTsp(ml: number): string {
  // 1 tsp = 4.929 ml
  const tsp = ml / 4.929;
  if (tsp >= 3) {
    const tbsp = roundTo(tsp / 3, 1);
    return `${tbsp} tbsp`;
  }
  return `${roundTo(tsp, 1)} tsp`;
}

// --- Recipe Generators ---

function generateQuickPickleRecipe(entries: HarvestEntry[]): RecipeOutput {
  const produceNames = entries
    .map((e) => {
      const p = PRODUCE.find((pr) => pr.id === e.produceId);
      return p ? p.name : e.produceId;
    })
    .join(" & ");
  const totalWeight = entries.reduce((sum, e) => sum + e.weightGrams, 0);

  // Determine jar size
  const primaryProduce = PRODUCE.find((p) => p.id === entries[0].produceId);
  const jarSize = totalWeight > 200 ? "pint" : (primaryProduce?.defaultJarSize ?? "half-pint");
  const jarMl = getJarMl(jarSize);

  // Quick Pickle Logic: equal parts water + vinegar, 2% salt by total liquid weight
  // Estimate: produce takes ~60% of jar volume, brine fills remaining ~40%
  const brineMl = jarMl * 0.4;
  const waterMl = brineMl / 2;
  const vinegarMl = brineMl / 2;
  const saltGrams = roundTo(brineMl * 1.0 * 0.02, 1); // 2% of brine (water density ~1g/ml)
  const sugarGrams = roundTo(brineMl * 0.02, 1); // optional 2% sugar

  // Pick primary vinegar from first produce
  const vinegarType =
    primaryProduce?.defaultVinegar === "white"
      ? "White Distilled Vinegar (5% acidity)"
      : primaryProduce?.defaultVinegar === "apple-cider"
        ? "Apple Cider Vinegar (5% acidity)"
        : "Rice Vinegar (4-5% acidity)";

  // Spices based on produce
  const allFlavors = entries.flatMap((e) => {
    const p = PRODUCE.find((pr) => pr.id === e.produceId);
    return p?.flavorPairings ?? [];
  });
  const uniqueFlavors = [...new Set(allFlavors)].slice(0, 4);
  const spiceIngredients: RecipeIngredient[] = uniqueFlavors.map((f) => ({
    name: formatSpiceName(f),
    amount: "to taste",
    note: "1-2 pieces or a pinch",
  }));

  const ingredients: RecipeIngredient[] = [
    {
      name: "Your Harvest",
      amount: formatGrams(totalWeight),
      amountGrams: totalWeight,
      note: produceNames,
    },
    {
      name: vinegarType,
      amount: formatMl(vinegarMl),
      amountMl: vinegarMl,
    },
    {
      name: "Water",
      amount: formatMl(waterMl),
      amountMl: waterMl,
    },
    {
      name: "Fine Sea Salt or Pickling Salt",
      amount: formatGrams(saltGrams),
      amountGrams: saltGrams,
      note: "Do NOT use iodized table salt",
    },
    {
      name: "Sugar (optional)",
      amount: formatGrams(sugarGrams),
      amountGrams: sugarGrams,
      note: "Adjust to taste; omit for sour pickles",
    },
    ...spiceIngredients,
  ];

  const steps = [
    `Prepare your ${jarSize} Mason jar by washing it thoroughly with hot soapy water. You do NOT need to sterilize for refrigerator pickles.`,
    `Wash and prep your ${produceNames.toLowerCase()}: slice jalapeños into rounds, cut carrots into sticks, halve cherry tomatoes, or slice onions into thin rings. Pack them tightly into the jar, leaving about 1 inch (2.5 cm) of headspace at the top.`,
    `In a small saucepan, combine the ${formatMl(vinegarMl)} of vinegar, ${formatMl(waterMl)} of water, ${formatGrams(saltGrams)} of salt, and sugar if using. Bring to a gentle simmer over medium heat, stirring until the salt and sugar dissolve completely (about 2-3 minutes). Do NOT boil.`,
    `Carefully pour the hot brine over the packed produce in the jar. Use a butter knife or chopstick to gently press down and release any trapped air bubbles. Ensure the produce is fully submerged.`,
    `Wipe the rim of the jar with a clean damp cloth. Secure the lid tightly. Let the jar cool to room temperature on the counter (about 1-2 hours).`,
    `Once cooled, place the jar in the refrigerator. Your pickles will be ready to eat in as little as 24 hours, but they reach peak flavor at 3-5 days.`,
  ];

  return {
    title: `Quick-Pickled ${produceNames}`,
    method: "quick-pickle",
    jarSize,
    jarSizeMl: jarMl,
    servings: jarSize === "half-pint" ? 4 : 8,
    ingredients,
    equipment: [
      `1 ${jarSize} Mason jar with lid`,
      "Small saucepan",
      "Cutting board & knife",
      "Measuring cups/spoons",
      "Kitchen scale (recommended)",
    ],
    steps,
    storage: "Store in the refrigerator at or below 4°C (40°F). Keep the produce submerged in the brine at all times.",
    shelfLife: "Refrigerator pickles will keep for 1-2 months. The texture will soften over time and the flavor will continue to develop.",
    safetyNote:
      "This is a refrigerator pickle recipe, NOT a shelf-stable canning recipe. It must be kept refrigerated. Do NOT attempt to store at room temperature. Always use vinegar with at least 5% acidity.",
    totalWeightGrams: totalWeight,
  };
}

function formatSpiceName(f: string): string {
  const map: Record<string, string> = {
    garlic: "Garlic Cloves",
    onion: "Onion (quarter)",
    dill: "Fresh Dill Sprigs",
    "chili flake": "Red Chili Flakes",
    peppercorn: "Black Peppercorns",
    "bay leaf": "Dried Bay Leaf",
    oregano: "Dried Oregano",
    cumin: "Whole Cumin Seeds",
    ginger: "Fresh Ginger (sliced)",
    coriander: "Whole Coriander Seeds",
    "mustard seed": "Whole Mustard Seeds",
    turmeric: "Ground Turmeric",
    basil: "Fresh Basil Leaves",
    thyme: "Fresh Thyme Sprigs",
    cilantro: "Fresh Cilantro",
    lemon: "Lemon Juice (fresh)",
    vanilla: "Vanilla Bean or Extract",
    balsamic: "Balsamic Vinegar (splash)",
    "black pepper": "Cracked Black Pepper",
    cinnamon: "Cinnamon Stick",
    cloves: "Whole Cloves",
    bourbon: "Bourbon (splash, optional)",
  };
  return map[f] ?? f.charAt(0).toUpperCase() + f.slice(1);
}

function generateFermentRecipe(entries: HarvestEntry[]): RecipeOutput {
  const produceNames = entries
    .map((e) => {
      const p = PRODUCE.find((pr) => pr.id === e.produceId);
      return p ? p.name : e.produceId;
    })
    .join(" & ");
  const totalWeight = entries.reduce((sum, e) => sum + e.weightGrams, 0);

  const primaryProduce = PRODUCE.find((p) => p.id === entries[0].produceId);
  const jarSize = totalWeight > 200 ? "pint" : (primaryProduce?.defaultJarSize ?? "half-pint");
  const jarMl = getJarMl(jarSize);

  // Fermentation Logic: 2.5% salt by produce weight (safe middle ground)
  const saltGrams = roundTo(totalWeight * 0.025, 1);
  // Water to submerge: estimate water needed = jar volume - produce volume - headspace
  // Produce is ~60% of jar, headspace ~15%, so brine ~25% of jar
  const waterMl = jarMl * 0.3;

  // Spices
  const allFlavors = entries.flatMap((e) => {
    const p = PRODUCE.find((pr) => pr.id === e.produceId);
    return p?.flavorPairings ?? [];
  });
  const uniqueFlavors = [...new Set(allFlavors)].slice(0, 3);
  const spiceIngredients: RecipeIngredient[] = uniqueFlavors.map((f) => ({
    name: formatSpiceName(f),
    amount: "to taste",
    note: "1-2 pieces or a pinch",
  }));

  const ingredients: RecipeIngredient[] = [
    {
      name: "Your Harvest",
      amount: formatGrams(totalWeight),
      amountGrams: totalWeight,
      note: produceNames,
    },
    {
      name: "Non-Iodized Salt (Sea Salt, Kosher, or Pickling Salt)",
      amount: formatGrams(saltGrams),
      amountGrams: saltGrams,
      note: `This is 2.5% of produce weight — the sweet spot for crunchy, safe fermentation`,
    },
    {
      name: "Filtered or Chlorine-Free Water",
      amount: formatMl(waterMl),
      amountMl: waterMl,
      note: "Tap water can be left uncovered for 30 min to off-gas chlorine",
    },
    ...spiceIngredients,
  ];

  const fermentDays = totalWeight > 300 ? "5-7" : "4-6";

  const steps = [
    `Wash your ${jarSize} Mason jar and lid with hot soapy water. Rinse well.`,
    `Wash and prep your ${produceNames.toLowerCase()}. For even fermentation, cut pieces to roughly uniform size. Slice dense vegetables (carrots, radishes) no thicker than 1/4 inch (6mm). Cherry tomatoes can be left whole but prick each one with a toothpick to allow brine penetration.`,
    `Pack the produce tightly into the jar. Add your spices throughout the layers as you pack — this distributes flavor evenly.`,
    `Dissolve ${formatGrams(saltGrams)} of salt in ${formatMl(waterMl)} of filtered water. Stir until completely clear. This is your brine.`,
    `Pour the brine over the produce. CRITICAL: Every single piece must be fully submerged. If any float, use a folded cabbage leaf, a small zip-lock bag filled with water, or a fermentation weight to hold them down. Leave 1 inch (2.5 cm) of headspace.`,
    `Screw the lid on loosely — NOT tight. Gases need to escape during fermentation. If using a standard Mason jar, tighten then back off a quarter turn. Alternatively, use an airlock lid.`,
    `Place the jar on a plate or in a bowl (to catch any overflow) and store at room temperature, away from direct sunlight. Ideal temperature is 18-22°C (65-72°F).`,
    `Check daily. You should see bubbles forming after 1-3 days — that means fermentation is active. Skim off any white film (kahm yeast) with a clean spoon; this is harmless but can affect flavor if left too long.`,
    `Taste test after ${fermentDays} days. When it reaches your preferred tanginess, put a tight lid on and move to the refrigerator. This stops fermentation.`,
  ];

  return {
    title: `Lacto-Fermented ${produceNames}`,
    method: "ferment",
    jarSize,
    jarSizeMl: jarMl,
    servings: jarSize === "half-pint" ? 4 : 8,
    ingredients,
    equipment: [
      `1 ${jarSize} Mason jar with lid (or airlock lid)`,
      "Fermentation weight or small zip-lock bag",
      "Plate or bowl (to catch overflow)",
      "Kitchen scale (strongly recommended for salt accuracy)",
      "Cutting board & knife",
    ],
    steps,
    storage:
      "Once fermented to your liking, store in the refrigerator at or below 4°C (40°F). Keep produce submerged.",
    shelfLife: `Fermented vegetables will keep for 3-6 months refrigerated. The flavor continues to develop (and get more sour) over time. Texture is best in the first 2 months.`,
    safetyNote:
      "Fermentation is safe when done correctly. Key rules: (1) Use proper salt ratio (2-3%), never less. (2) Keep produce fully submerged at all times. (3) Discard if you see fuzzy mold (green/black/pink), smell putrid, or see pink/black slime. Kahm yeast (white film) is safe to skim off. (4) When in doubt, throw it out.",
    totalWeightGrams: totalWeight,
  };
}

function generateWaterBathRecipe(entries: HarvestEntry[]): RecipeOutput {
  const produceNames = entries
    .map((e) => {
      const p = PRODUCE.find((pr) => pr.id === e.produceId);
      return p ? p.name : e.produceId;
    })
    .join(" & ");
  const totalWeight = entries.reduce((sum, e) => sum + e.weightGrams, 0);

  const primaryProduce = PRODUCE.find((p) => p.id === entries[0].produceId);
  const jarSize = totalWeight > 250 ? "pint" : (primaryProduce?.defaultJarSize ?? "half-pint");
  const jarMl = getJarMl(jarSize);

  // Determine processing time from primary produce
  const processingMinutes = primaryProduce?.waterBathProcessingMinutes ?? 15;
  const needsAcid = primaryProduce?.waterBathAcidified ?? false;

  // For water-bath: we need acidification if the produce is low-acid
  // Standard recipes use specific ratios; let's build a safe small-batch
  // For pickled products via water bath: 50% vinegar / 50% water + 5% salt of liquid
  const brineMl = jarMl * 0.35;
  const vinegarMl = brineMl / 2;
  const waterMl = brineMl / 2;
  const saltGrams = roundTo(brineMl * 0.025, 1);

  // For fruit preserves/jams
  const isFruit = ["strawberry", "peach"].includes(entries[0].produceId);

  let ingredients: RecipeIngredient[];
  let steps: string[];
  let safetyNote: string;

  if (isFruit) {
    // Fruit preserve/jam approach
    const sugarGrams = roundTo(totalWeight * 0.5, 0); // 50% sugar by weight
    const lemonMl = roundTo(totalWeight * 0.02, 0); // ~2% lemon juice

    ingredients = [
      {
        name: "Your Harvest",
        amount: formatGrams(totalWeight),
        amountGrams: totalWeight,
        note: produceNames,
      },
      {
        name: "Granulated Sugar",
        amount: formatGrams(sugarGrams),
        amountGrams: sugarGrams,
        note: `50% of fruit weight — this ratio ensures proper gel and safe preservation`,
      },
      {
        name: "Fresh Lemon Juice",
        amount: formatMl(lemonMl),
        amountMl: lemonMl,
        note: "Critical for safe acidity levels",
      },
    ];

    steps = [
      `Sterilize your ${jarSize} Mason jar and lid: submerge in boiling water for 10 minutes, then keep hot until ready to fill. Also prepare a small pot of boiling water for the canner.`,
      `Wash and prep your ${produceNames.toLowerCase()}. For strawberries, hull and halve them. For peaches, peel, pit, and slice into 1/2 inch wedges. Mash about half the fruit for a chunky jam texture.`,
      `Place the prepared fruit in a wide, heavy-bottomed saucepan. Add ${formatGrams(sugarGrams)} of sugar and ${formatMl(lemonMl)} of lemon juice. Stir well.`,
      `Bring to a rolling boil over medium-high heat, stirring frequently to prevent scorching. Continue boiling for 10-15 minutes, stirring often, until the mixture thickens. Test for gel: put a small spoonful on a cold plate — it should wrinkle when you push it with your finger.`,
      `Ladle the hot jam into the sterilized jar, leaving 1/4 inch (6mm) of headspace. Run a non-metallic spatula around the inside to release air bubbles. Wipe the rim clean with a damp cloth.`,
      `Place the sterilized lid on the jar and screw on the band until fingertip-tight (do not over-tighten).`,
      `Place the jar on a canning rack in your boiling water canner. Ensure the jar is covered by at least 1-2 inches of water. Bring back to a full rolling boil and process for ${processingMinutes} minutes, adjusting for altitude if needed (+1 minute per 1000 ft above 1000 ft).`,
      `Turn off the heat, remove the canner lid, and wait 5 minutes. Using jar lifter, remove the jar without tilting and place on a towel on your counter. Do NOT retighten the lid. Let cool undisturbed for 12-24 hours.`,
      `Check the seal: press the center of the lid — it should be firm and not pop. If it pops, refrigerate immediately and use within 2 weeks. Label with the date and store.`,
    ];

    safetyNote =
      "Water-bath canning is ONLY safe for high-acid foods (pH below 4.6). This recipe includes lemon juice to ensure safe acidity. Do NOT alter the lemon juice amount. If you live above 1,000 ft elevation, you MUST add 1 minute of processing time per 1,000 ft. Do NOT use this recipe for low-acid vegetables without added vinegar/acidification.";
  } else {
    // Pickled vegetable via water-bath canning
    const vinegarType =
      primaryProduce?.defaultVinegar === "white"
        ? "White Distilled Vinegar (5% acidity)"
        : primaryProduce?.defaultVinegar === "apple-cider"
          ? "Apple Cider Vinegar (5% acidity)"
          : "Rice Vinegar — NOTE: Only use if 5% acidity or higher";

    const allFlavors = entries.flatMap((e) => {
      const p = PRODUCE.find((pr) => pr.id === e.produceId);
      return p?.flavorPairings ?? [];
    });
    const uniqueFlavors = [...new Set(allFlavors)].slice(0, 4);
    const spiceIngredients: RecipeIngredient[] = uniqueFlavors.map((f) => ({
      name: formatSpiceName(f),
      amount: "to taste",
      note: "1-2 pieces or a pinch",
    }));

    ingredients = [
      {
        name: "Your Harvest",
        amount: formatGrams(totalWeight),
        amountGrams: totalWeight,
        note: produceNames,
      },
      {
        name: vinegarType,
        amount: formatMl(vinegarMl),
        amountMl: vinegarMl,
        note: "MUST be 5% acidity for safe canning",
      },
      {
        name: "Water",
        amount: formatMl(waterMl),
        amountMl: waterMl,
      },
      {
        name: "Pickling Salt or Kosher Salt",
        amount: formatGrams(saltGrams),
        amountGrams: saltGrams,
        note: "Do NOT use iodized table salt",
      },
      ...spiceIngredients,
    ];

    steps = [
      `Sterilize your ${jarSize} Mason jar and lid: submerge in boiling water for 10 minutes, then keep hot until ready to fill.`,
      `Wash and prep your ${produceNames.toLowerCase()}. Cut into uniform pieces for even processing. Pack the raw vegetables tightly into the hot jar, leaving 1/2 inch (1.25 cm) of headspace.`,
      `In a saucepan, combine the ${formatMl(vinegarMl)} of vinegar, ${formatMl(waterMl)} of water, and ${formatGrams(saltGrams)} of salt. Bring to a rolling boil, stirring until salt dissolves.`,
      `Carefully ladle the boiling hot brine over the vegetables, maintaining the 1/2 inch headspace. Run a non-metallic spatula around the inside to release air bubbles. Add more brine if needed to maintain headspace.`,
      `Wipe the jar rim with a clean, damp cloth. Place the sterilized lid on and screw the band until fingertip-tight.`,
      `Place the jar on the canning rack in a boiling water canner. Ensure the jar is covered by 1-2 inches of water. Bring to a full rolling boil and process for ${processingMinutes} minutes, adjusting for altitude if needed (+1 minute per 1000 ft above 1000 ft).`,
      `Turn off heat, remove lid, wait 5 minutes. Using jar lifter, remove the jar without tilting. Place on a towel and let cool undisturbed for 12-24 hours.`,
      `Check the seal: the lid center should be firm and not pop when pressed. Label with the date. Store in a cool, dark place.`,
    ];

    safetyNote =
      "Water-bath canning is ONLY safe for high-acid foods. The vinegar in this recipe provides the necessary acidity (final pH below 4.6). Do NOT reduce the vinegar amount. Use only vinegar with exactly 5% acidity. If you live above 1,000 ft elevation, add 1 minute processing time per 1,000 ft. Do NOT attempt water-bath canning for low-acid vegetables without proper acidification — use pressure canning instead.";
  }

  return {
    title: isFruit ? `Water-Bath Canned ${produceNames}` : `Pickled ${produceNames} (Water-Bath Canned)`,
    method: "water-bath",
    jarSize,
    jarSizeMl: jarMl,
    servings: jarSize === "half-pint" ? 4 : 8,
    ingredients,
    equipment: [
      `1 ${jarSize} Mason jar with 2-piece lid`,
      "Boiling water canner (or a large, deep pot with a lid and rack)",
      "Jar lifter or tongs",
      "Canning funnel",
      "Non-metallic spatula or chopstick",
      "Kitchen scale",
      "Cutting board & knife",
    ],
    steps,
    storage: isFruit
      ? "Store sealed jars in a cool, dark place (50-70°F / 10-21°C). Once opened, refrigerate and use within 3 weeks."
      : "Store sealed jars in a cool, dark, dry place (50-70°F / 10-21°C). Once opened, refrigerate and use within 1-2 months.",
    shelfLife: isFruit
      ? "Properly sealed and stored, fruit preserves will keep for 12-18 months. For best quality, use within 12 months."
      : "Properly sealed and stored, pickled vegetables will keep for up to 12 months. For best quality and crunch, use within 6-8 months.",
    safetyNote,
    totalWeightGrams: totalWeight,
  };
}

// --- Main Recipe Generator ---
export function generateRecipe(
  entries: HarvestEntry[],
  method: PreservingMethod
): RecipeOutput | null {
  if (entries.length === 0) return null;

  // Validate that all produce supports the selected method
  for (const entry of entries) {
    const produce = PRODUCE.find((p) => p.id === entry.produceId);
    if (!produce) return null;
    if (method === "quick-pickle" && !produce.quickPickle) return null;
    if (method === "ferment" && !produce.ferment) return null;
    if (method === "water-bath" && !produce.waterBath) return null;
  }

  switch (method) {
    case "quick-pickle":
      return generateQuickPickleRecipe(entries);
    case "ferment":
      return generateFermentRecipe(entries);
    case "water-bath":
      return generateWaterBathRecipe(entries);
    default:
      return null;
  }
}

// --- Method Info for UI ---
export interface MethodInfo {
  id: PreservingMethod;
  name: string;
  tagline: string;
  description: string;
  timeRange: string;
  difficulty: "Easy" | "Medium" | "Advanced";
  equipmentSummary: string;
}

export const METHOD_INFO: MethodInfo[] = [
  {
    id: "quick-pickle",
    name: "Quick Pickle",
    tagline: "Ready in 24 hours, no canning gear needed",
    description:
      "The fastest path from harvest to jar. Hot vinegar brine is poured over your vegetables for instant crunchy, tangy pickles. No special equipment required — just a jar, a saucepan, and your harvest. Perfect for apartment dwellers who want immediate results without the learning curve of canning.",
    timeRange: "15 min prep + 24 hr wait",
    difficulty: "Easy",
    equipmentSummary: "Mason jar, saucepan, knife",
  },
  {
    id: "ferment",
    name: "Lacto-Ferment",
    tagline: "Gut-friendly probiotics, zero vinegar",
    description:
      "The ancient art of preservation using only salt, water, and time. Lactic acid bacteria naturally present on your vegetables create tangy, complex flavors while producing beneficial probiotics. No heat, no vinegar — just the vegetables doing the work. The most rewarding method for patient apartment homesteaders.",
    timeRange: "15 min prep + 4-10 days fermenting",
    difficulty: "Medium",
    equipmentSummary: "Mason jar, fermentation weight, kitchen scale",
  },
  {
    id: "water-bath",
    name: "Water-Bath Can",
    tagline: "Shelf-stable for months, pantry-ready",
    description:
      "The real deal — properly canned preserves that sit safely on your pantry shelf for up to a year. A boiling water bath kills spoilage organisms and creates a vacuum seal. Requires a large pot (or canner) and careful attention to acidity levels, but the payoff is a pantry full of your own preserves. Small-batch recipes scaled for apartment quantities.",
    timeRange: "45-60 min total",
    difficulty: "Advanced",
    equipmentSummary: "Large pot/canner, jar lifter, canning funnel",
  },
];

export function getMethodInfo(method: PreservingMethod): MethodInfo {
  return METHOD_INFO.find((m) => m.id === method)!;
}