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
  jarSize: "half-pint" | "pint" | "half-gallon";
  jarSizeMl: number;
  jarCount: number;
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
    waterBathProcessingMinutes: 5,
    flavorPairings: ["lemon", "vanilla", "balsamic", "black pepper"],
    defaultJarSize: "half-pint",
  },
  {
    id: "blackberry",
    name: "Blackberries",
    emoji: "🫐",
    quickPickle: false,
    ferment: false,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 5,
    flavorPairings: ["lemon", "vanilla", "black pepper", "mint"],
    defaultJarSize: "half-pint",
  },
  {
    id: "raspberry",
    name: "Raspberries",
    emoji: "🫐",
    quickPickle: false,
    ferment: false,
    waterBath: true,
    defaultVinegar: "white",
    waterBathAcidified: false,
    waterBathProcessingMinutes: 5,
    flavorPairings: ["lemon", "vanilla", "mint", "rose"],
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
    waterBathProcessingMinutes: 5,
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
    waterBathProcessingMinutes: 5,
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
    waterBathProcessingMinutes: 10,
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

// A packed jar holds roughly 0.7 g of prepared produce per ml of jar volume (about 330 g per pint).
function jarsNeeded(totalWeight: number, jarMl: number): number {
  return Math.max(1, Math.ceil(totalWeight / (jarMl * 0.7)));
}

function jarLabel(count: number, size: string): string {
  return count > 1 ? `${count} ${size} Mason jars` : `1 ${size} Mason jar`;
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
  const jarCount = jarsNeeded(totalWeight, jarMl);

  // Quick Pickle Logic: equal parts water + vinegar, 2% salt by total liquid weight
  // Estimate: produce takes ~60% of jar volume, brine fills remaining ~40%
  const brineMl = jarMl * 0.4 * jarCount;
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
    `Prepare ${jarLabel(jarCount, jarSize)} by washing ${jarCount > 1 ? "them" : "it"} thoroughly with hot soapy water. You do NOT need to sterilize for refrigerator pickles.`,
    `Wash and prep your ${produceNames.toLowerCase()}: slice jalapeños into rounds, cut carrots into sticks, halve cherry tomatoes, or slice onions into thin rings. Pack them tightly into the jar${jarCount > 1 ? "s" : ""}, leaving about 1 inch (2.5 cm) of headspace at the top.`,
    `In a small saucepan, combine the ${formatMl(vinegarMl)} of vinegar, ${formatMl(waterMl)} of water, ${formatGrams(saltGrams)} of salt, and sugar if using. Bring to a gentle simmer over medium heat, stirring until the salt and sugar dissolve completely (about 2-3 minutes). Do NOT boil.`,
    `Carefully pour the hot brine over the packed produce, dividing it evenly between the jars. Use a butter knife or chopstick to gently press down and release any trapped air bubbles. Ensure the produce is fully submerged.`,
    `Wipe the rim of the jar with a clean damp cloth. Secure the lid tightly. Let the jar cool to room temperature on the counter (about 1-2 hours).`,
    `Once cooled, place the jar in the refrigerator. Your pickles will be ready to eat in as little as 24 hours, but they reach peak flavor at 3-5 days.`,
  ];

  return {
    title: `Quick-Pickled ${produceNames}`,
    method: "quick-pickle",
    jarSize,
    jarSizeMl: jarMl,
    jarCount,
    servings: (jarSize === "half-pint" ? 4 : 8) * jarCount,
    ingredients,
    equipment: [
      `${jarLabel(jarCount, jarSize)} with ${jarCount > 1 ? "lids" : "lid"}`,
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
  const jarCount = jarsNeeded(totalWeight, jarMl);
  const waterMl = jarMl * 0.3 * jarCount;

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
      name: "Pickling (Canning) Salt",
      amount: formatGrams(saltGrams),
      amountGrams: saltGrams,
      note: `This is 2.5% of produce weight. Use pickling or canning salt, not iodized table salt, and not flake salt such as kosher, which varies in density. Weigh it.`,
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
    `Wash ${jarLabel(jarCount, jarSize)} and lids with hot soapy water. Rinse well.`,
    `Wash and prep your ${produceNames.toLowerCase()}. For even fermentation, cut pieces to roughly uniform size. Slice dense vegetables (carrots, radishes) no thicker than 1/4 inch (6mm). Cherry tomatoes can be left whole but prick each one with a toothpick to allow brine penetration.`,
    `Pack the produce tightly into the jar. Add your spices throughout the layers as you pack — this distributes flavor evenly.`,
    `Dissolve ${formatGrams(saltGrams)} of salt in ${formatMl(waterMl)} of filtered water. Stir until completely clear. This is your brine.`,
    `Pour the brine over the produce. CRITICAL: Every single piece must be fully submerged. If any float, use a folded cabbage leaf, a small zip-lock bag filled with some of the same brine (so a leak won't water down your ferment), or a fermentation weight to hold them down. Leave 1 inch (2.5 cm) of headspace.`,
    `Screw the lid on loosely — NOT tight. Gases need to escape during fermentation. If using a standard Mason jar, tighten then back off a quarter turn. Alternatively, use an airlock lid.`,
    `Place the jar on a plate or in a bowl (to catch any overflow) and store at room temperature, away from direct sunlight. Keep it at 70 to 75°F (21 to 24°C), the range the National Center for Home Food Preservation recommends. Cooler is slower, and below 60°F (15°C) it may not ferment.`,
    `Check daily. You should see bubbles forming after 1-3 days — that means fermentation is active. Remove any surface scum promptly with a clean spoon. A thin, flat white film is often kahm yeast, which is harmless but can taste off. Fuzzy or colored growth is mold, and then the whole batch goes in the bin. If you can't tell which it is, throw it out.`,
    `Taste test after ${fermentDays} days. When it reaches your preferred tanginess, put a tight lid on and move to the refrigerator. This stops fermentation.`,
  ];

  return {
    title: `Lacto-Fermented ${produceNames}`,
    method: "ferment",
    jarSize,
    jarSizeMl: jarMl,
    jarCount,
    servings: (jarSize === "half-pint" ? 4 : 8) * jarCount,
    ingredients,
    equipment: [
      `${jarLabel(jarCount, jarSize)} with ${jarCount > 1 ? "lids (or airlock lids)" : "lid (or airlock lid)"}`,
      "Fermentation weight or small zip-lock bag",
      "Plate or bowl (to catch overflow)",
      "Kitchen scale (strongly recommended for salt accuracy)",
      "Cutting board & knife",
    ],
    steps,
    storage:
      "Once fermented to your liking, store in the refrigerator at or below 4°C (40°F). Keep produce submerged.",
    shelfLife: `Keep it refrigerated. The National Center for Home Food Preservation gives about 4 to 6 months in the fridge for fermented cucumber pickles, and it has no tested figure for other vegetables, so check the jar every time you open it. The flavor keeps getting more sour over time.`,
    safetyNote:
      "Fermentation is safe when done correctly. Key rules: (1) Use proper salt ratio (2-3%), never less. (2) Keep produce fully submerged at all times. (3) Remove surface scum promptly, and discard the batch if you see fuzzy or colored mold, it turns soft or slimy, or it smells bad. A thin, flat white film may be kahm yeast; if you can't tell it from mold, throw it out. (4) When in doubt, throw it out.",
    totalWeightGrams: totalWeight,
  };
}

// --- Cucumber pickles: the tested NCHFP dill pickle recipe at NC State's half-gallon size ---
// Quantities are NCHFP's tested dill pickle recipe as NC State publishes it for a 1/2 gallon
// container: 2 lb of 4-inch pickling cucumbers, 1 tbsp dill seed or 2 to 3 heads of dill, 1/4 cup
// canning or pickling salt, 2 tbsp 5% vinegar, 4 cups water. There is no smaller tested size, so
// this recipe is not scaled down and the vinegar and salt are never cut.
const CUCUMBER_JAR_GRAMS = 900;
const HALF_GALLON_ML = 1893;

function quarterCups(n: number): string {
  const frac = ["", "1/4", "1/2", "3/4"][n % 4];
  const whole = Math.floor(n / 4);
  if (whole === 0) return `${frac} cup`;
  if (n % 4 === 0) return `${whole} ${whole > 1 ? "cups" : "cup"}`;
  return `${whole} ${frac} cups`;
}

function isCucumberOnly(entries: HarvestEntry[]): boolean {
  return entries.length > 0 && entries.every((e) => e.produceId === "cucumber");
}

function generateCucumberFermentRecipe(entries: HarvestEntry[]): RecipeOutput {
  const totalWeight = entries.reduce((sum, e) => sum + e.weightGrams, 0);
  const fullJars = Math.floor(totalWeight / CUCUMBER_JAR_GRAMS);
  const jarCount = Math.max(1, fullJars);
  const leftover = Math.max(0, totalWeight - jarCount * CUCUMBER_JAR_GRAMS);
  const tooLittle = totalWeight < CUCUMBER_JAR_GRAMS;
  const jarWord = jarCount > 1 ? "jars" : "jar";

  const ingredients: RecipeIngredient[] = [
    {
      name: "Pickling Cucumbers, about 4 inches (10 cm) long",
      amount: formatGrams(jarCount * CUCUMBER_JAR_GRAMS),
      amountGrams: jarCount * CUCUMBER_JAR_GRAMS,
      note: "2 pounds (900 g) per half-gallon jar. Brine them within 24 hours of picking.",
    },
    {
      name: "Dill Seed, or Fresh or Dry Dill Heads",
      amount: `${jarCount} tablespoon${jarCount > 1 ? "s" : ""} of seed, or ${jarCount * 2} to ${jarCount * 3} heads`,
    },
    {
      name: "Canning or Pickling Salt",
      amount: quarterCups(jarCount),
      note: "Measure it as written. Not iodized table salt, and not flake salt such as kosher, which varies in density. Do not cut it back.",
    },
    {
      name: "Vinegar, 5% Acidity",
      amount: `${jarCount * 2} tablespoons`,
      note: "Part of the tested recipe. Do not leave it out or change the amount.",
    },
    {
      name: "Water",
      amount: `${jarCount * 4} cups`,
      amountMl: jarCount * 946,
      note: "Soft water if yours is hard.",
    },
    {
      name: "Optional, per jar",
      amount: "1 clove of garlic, 1 dried pepper, 1 teaspoon whole mixed pickling spice",
      note: "Use whole spices, tied loosely in a cheesecloth bag so you can lift them out.",
    },
  ];

  const steps = [
    ...(tooLittle
      ? [
          `You have less than the 2 pounds (900 g) this recipe is written for. There is no tested smaller size, so use the Quick Pickle method for this amount, or wait until you have 2 pounds.`,
        ]
      : []),
    `Wash ${jarCount} half-gallon ${jarWord} and the lids in hot soapy water and rinse well.`,
    `Wash the cucumbers. Cut a 1/16-inch (1.5 mm) slice off the blossom end of each and discard it. Leave 1/4 inch (6 mm) of stem attached.`,
    `Put half the dill and any garlic, pepper or spice in the bottom of each jar. Add the cucumbers, then the rest of the dill and spices.`,
    `Dissolve the salt in the vinegar and water. Pour the brine over the cucumbers.`,
    `Weight the cucumbers so they stay 1 to 2 inches (2.5 to 5 cm) under the brine. Use a small, clean, food-grade zip bag, sealed and filled with some of the same brine, so a leak does not water down the jar. Never fill it with plain water. If you need more brine, mix it at the same proportions.`,
    `Cover with a clean towel or a loose lid. Keep the jar at 70 to 75°F (21 to 24°C) for about 3 to 4 weeks, away from direct sun. At 55 to 65°F (13 to 18°C) it takes 5 to 6 weeks. Avoid temperatures above 80°F (27°C), which make the pickles soft.`,
    `Check it several times a week and remove any surface scum promptly. A flat white film is often harmless kahm yeast. Fuzzy or colored growth is mold, and then the whole batch goes in the bin. If you cannot tell which it is, throw it out.`,
    `When fermentation is complete, move the jar to the refrigerator.`,
    ...(leftover >= 200
      ? [`You have about ${formatGrams(leftover)} of cucumbers left over. Use them for Quick Pickles, not for a partly filled ferment jar.`]
      : []),
  ];

  return {
    title: "Lacto-Fermented Dill Pickles",
    method: "ferment",
    jarSize: "half-gallon",
    jarSizeMl: HALF_GALLON_ML,
    jarCount,
    servings: 16 * jarCount,
    ingredients,
    equipment: [
      `${jarCount} clean half-gallon (about 2 L) ${jarWord}`,
      "Food-grade zip bag for a brine-filled weight, or a clean plate and glass weight",
      "Clean towel or loose lid",
      "Measuring cups and spoons",
      "Cutting board & knife",
    ],
    steps,
    storage:
      "Store fully fermented pickles in the refrigerator, keeping them under the brine and removing any surface scum regularly.",
    shelfLife:
      "About 4 to 6 months in the fridge if surface scum is removed regularly, according to the National Center for Home Food Preservation. Canning fully fermented pickles is its better way to store them; follow its dill pickle recipe for the canning step.",
    safetyNote:
      "This is the tested National Center for Home Food Preservation dill pickle recipe at a half-gallon size. Keep the proportions exactly: do not cut the salt, change the vinegar, or top up with plain water. Discard the batch if the pickles become soft or slimy, smell bad, or show fuzzy or colored mold. If you cannot tell yeast from mold, throw it out.",
    totalWeightGrams: totalWeight,
  };
}


// --- Vegetables: the tested NCHFP boiling-water canner recipes -------------------------------------
// Every quantity and time below comes from the National Center for Home Food Preservation page named
// beside it (adapted from the USDA Complete Guide to Home Canning, 2015). The published recipes are
// batch recipes. Each is divided by its published yield (pints or half-pints) to give one jar's worth,
// so the vinegar, water, salt and sugar keep the tested proportions. Process times depend on jar size
// and altitude, not on how many jars are in the pot, and are used exactly as published. Nothing is
// invented: where a page gives no amount for a thing (for example the weight of cauliflower florets),
// the figure is labelled as an estimate and is used only to count jars.
const FRUIT_IDS = ["strawberry", "peach", "blackberry", "raspberry"];

function perJarCups(n: number, cupsPerJar: number): string {
  const total = n * cupsPerJar;
  const whole = Math.floor(total + 1e-9);
  const rem = total - whole;
  const fracs: [number, string][] = [[0, ""], [1 / 8, "1/8"], [1 / 4, "1/4"], [1 / 3, "1/3"], [3 / 8, "3/8"], [1 / 2, "1/2"], [5 / 8, "5/8"], [2 / 3, "2/3"], [3 / 4, "3/4"], [7 / 8, "7/8"], [1, ""]];
  let best = fracs[0];
  for (const f of fracs) if (Math.abs(f[0] - rem) < Math.abs(best[0] - rem)) best = f;
  let w = whole;
  if (best[0] === 1) w += 1;
  const frac = best[0] === 1 ? "" : best[1];
  if (w === 0) return `${frac} cup`;
  return `${w}${frac ? " " + frac : ""} ${w > 1 || frac ? "cups" : "cup"}`;
}

function perJarSpoons(n: number, tspPerJar: number): string {
  const tsp = n * tspPerJar;
  if (tsp >= 3) {
    const q = Math.round((tsp / 3) * 4) / 4;
    const whole = Math.floor(q);
    const f = { 0: "", 0.25: "1/4", 0.5: "1/2", 0.75: "3/4" }[q - whole] ?? "";
    return `${whole}${f ? " " + f : ""} tbsp`;
  }
  const q = Math.round(tsp * 8) / 8;
  const whole = Math.floor(q);
  const rem = q - whole;
  const map: Record<number, string> = { 0: "", 0.125: "1/8", 0.25: "1/4", 0.375: "3/8", 0.5: "1/2", 0.625: "5/8", 0.75: "3/4", 0.875: "7/8" };
  const f = map[rem] ?? "";
  if (whole === 0) return `${f} tsp`;
  return `${whole}${f ? " " + f : ""} tsp`;
}

function perHalves(halves: number): string {
  const whole = Math.floor(halves / 2);
  const half = halves % 2 === 1;
  if (whole === 0) return "1/2";
  return `${whole}${half ? " 1/2" : ""}`;
}

type TimeBands = { label: string; minutes: number }[];

function altitudeLine(bands: TimeBands): string {
  return bands.map((b) => `${b.minutes} minutes ${b.label.startsWith("above") ? "" : "at "}${b.label}`).join(", ");
}

const PICKLE_BANDS = (a: number, b: number, c: number): TimeBands => [
  { label: "0 to 1,000 ft", minutes: a },
  { label: "1,001 to 6,000 ft", minutes: b },
  { label: "above 6,000 ft", minutes: c },
];

function canningSteps(opts: {
  jarCount: number;
  jarSizeWord: string;
  prepSteps: string[];
  bands: TimeBands;
  tooLittle: string | null;
  headspace: string;
}): string[] {
  const { jarCount, jarSizeWord, prepSteps, bands, tooLittle, headspace } = opts;
  const jars = `${jarCount} ${jarSizeWord} Mason jar${jarCount > 1 ? "s" : ""}`;
  return [
    ...(tooLittle ? [tooLittle] : []),
    `Wash ${jars} and the lids in hot soapy water and rinse. Keep the jars hot (in the canner or a low oven) until you fill them.`,
    ...prepSteps,
    `Wipe the rims clean with a damp cloth. Put the lids on and screw the bands on until fingertip-tight. Leave ${headspace} of headspace.`,
    `Lower the jars into a boiling water canner with the water at least 1 inch (2.5 cm) above the jar tops. Start the timer when the water is at a full rolling boil. Process for ${altitudeLine(bands)}. If you are not sure of your altitude, use the longer time.`,
    `Turn off the heat, remove the canner lid, and wait 5 minutes. Lift the jars out without tilting them and set them on a towel. Do NOT retighten the lids. Let them cool undisturbed for 12 to 24 hours.`,
    `Check each seal: press the center of the lid. It should be firm and not flex. Refrigerate any jar that did not seal and use it within a week or two. Label the sealed jars with the date and store them in a cool, dark place.`,
  ];
}

const VEG_CANNING_EQUIPMENT = (jarCount: number, jarSizeWord: string): string[] => [
  `${jarCount} ${jarSizeWord} Mason jar${jarCount > 1 ? "s" : ""} with 2-piece lids`,
  "Boiling water canner (a deep pot with a lid and a rack, deep enough for 1 inch of water over the jars)",
  "Jar lifter",
  "Canning funnel",
  "Non-metallic spatula or chopstick",
  "Measuring cups and spoons",
  "Cutting board & knife",
];

const POUND = 453.6;

function jarCountFor(totalWeight: number, gramsPerJar: number): { jarCount: number; tooLittle: boolean; leftover: number } {
  const full = Math.floor(totalWeight / gramsPerJar);
  const jarCount = Math.max(1, full);
  const tooLittle = totalWeight < gramsPerJar * 0.75;
  const leftover = Math.max(0, totalWeight - jarCount * gramsPerJar);
  return { jarCount, tooLittle, leftover };
}

function tooLittleStep(gramsPerJar: number, jarWord: string): string {
  return `You have less than one ${jarWord}'s worth (about ${formatGrams(gramsPerJar)}). The recipe below is written for whole jars, so either wait until you have enough, or use the Quick Pickle method, which keeps in the fridge and needs no canner.`;
}

function leftoverStep(leftover: number, gramsPerJar: number): string[] {
  return leftover >= gramsPerJar * 0.25
    ? [`You have about ${formatGrams(leftover)} left over, which is not enough for a full jar. Use it for Quick Pickles instead of packing a part-empty jar.`]
    : [];
}

const SHELF_STORAGE = "Store sealed jars in a cool, dark, dry place (50-70°F / 10-21°C). Once opened, refrigerate.";
const SHELF_LIFE = "For best quality, use within a year. Refrigerate after opening.";

// NCHFP "Dilled Beans": 4 lb beans, 8-16 dill heads, 8 cloves garlic (optional), 1/2 cup canning or pickling
// salt, 4 cups 5% white vinegar, 4 cups water, 1 tsp hot red pepper flakes (optional). Yield about 8 pints.
// Raw pack, pints: 5 min at 0-1,000 ft, 10 at 1,001-6,000, 15 above 6,000.
function generateDilledBeansRecipe(totalWeight: number): RecipeOutput {
  const GRAMS_PER_PINT = (4 * POUND) / 8;
  const { jarCount, tooLittle, leftover } = jarCountFor(totalWeight, GRAMS_PER_PINT);
  const n = jarCount;
  const ingredients: RecipeIngredient[] = [
    { name: "Fresh Tender Green or Yellow Beans, 5 to 6 inches (12 to 15 cm) long", amount: formatGrams(n * GRAMS_PER_PINT), amountGrams: n * GRAMS_PER_PINT, note: "About 1/2 pound (227 g) per pint jar." },
    { name: "Fresh Dill Heads", amount: `${n} to ${n * 2}`, note: "1 to 2 heads per jar." },
    { name: "Garlic Cloves (optional)", amount: `${n}`, note: "1 clove per jar." },
    { name: "Canning or Pickling Salt", amount: perJarSpoons(n, 3), note: "1 tablespoon per jar. Not iodized table salt, and not flake salt such as kosher, which varies in density. Do not cut it back." },
    { name: "White Vinegar, 5% Acidity", amount: perJarCups(n, 1 / 2), amountMl: Math.round(n * 118), note: "Part of the tested recipe. Do not reduce it or swap the vinegar for something weaker." },
    { name: "Water", amount: perJarCups(n, 1 / 2), amountMl: Math.round(n * 118) },
    { name: "Hot Red Pepper Flakes (optional)", amount: perJarSpoons(n, 1 / 8) },
  ];
  const steps = canningSteps({
    jarCount: n,
    jarSizeWord: "pint",
    tooLittle: tooLittle ? tooLittleStep(GRAMS_PER_PINT, "pint jar") : null,
    headspace: "1/2 inch (1.25 cm)",
    bands: PICKLE_BANDS(5, 10, 15),
    prepSteps: [
      `Wash the beans, trim the ends, and cut them into 4-inch (10 cm) lengths.`,
      `In each hot jar put 1 to 2 dill heads and, if you like, 1 clove of garlic. Pack the beans upright, trimming them to fit, leaving 1/2 inch (1.25 cm) of headspace. This is a raw pack.`,
      `Combine the salt, vinegar, water and pepper flakes in a saucepan and bring to a boil. Pour the hot brine over the beans, leaving 1/2 inch (1.25 cm) of headspace.`,
      ...leftoverStep(leftover, GRAMS_PER_PINT),
    ],
  });
  return {
    title: "Dilled Beans (Water-Bath Canned)",
    method: "water-bath",
    jarSize: "pint",
    jarSizeMl: 473,
    jarCount: n,
    servings: 6 * n,
    ingredients,
    equipment: VEG_CANNING_EQUIPMENT(n, "pint"),
    steps,
    storage: SHELF_STORAGE,
    shelfLife: SHELF_LIFE,
    safetyNote:
      "This is the tested National Center for Home Food Preservation Dilled Beans recipe, divided by its yield of 8 pints so each jar keeps the tested proportions. Keep the vinegar, water and salt exactly as written: do not cut the vinegar, do not add extra water, and do not shorten the processing time. Use vinegar labelled 5% acidity. Pints are the tested jar size.",
    totalWeightGrams: totalWeight,
  };
}

// NCHFP "Pickled Bell Peppers": 7 lb firm bell peppers, 3 1/2 cups sugar, 3 cups 5% vinegar, 3 cups water,
// 9 cloves garlic, 4 1/2 tsp canning or pickling salt. Yield about 9 pints. 1/2 clove garlic and 1/4 tsp salt
// per half-pint, double for pints. Hot pack, half-pints or pints: 5 / 10 / 15.
function generatePickledPeppersRecipe(totalWeight: number): RecipeOutput {
  const GRAMS_PER_PINT = (7 * POUND) / 9;
  const SUGAR_G_PER_PINT = (3.5 * 200) / 9;
  const { jarCount, tooLittle, leftover } = jarCountFor(totalWeight, GRAMS_PER_PINT);
  const n = jarCount;
  const sugarG = Math.round(n * SUGAR_G_PER_PINT);
  const ingredients: RecipeIngredient[] = [
    { name: "Firm Bell Peppers", amount: formatGrams(n * GRAMS_PER_PINT), amountGrams: n * GRAMS_PER_PINT, note: "About 3/4 pound (353 g) per pint jar." },
    { name: "Granulated Sugar", amount: `${formatGrams(sugarG)} (about ${perJarCups(n, 3.5 / 9)})`, amountGrams: sugarG, note: "Part of the tested recipe. Do not leave it out." },
    { name: "Vinegar, 5% Acidity", amount: perJarCups(n, 3 / 9), amountMl: Math.round((n * 3 * 236.6) / 9), note: "Part of the tested recipe. Do not reduce it." },
    { name: "Water", amount: perJarCups(n, 3 / 9), amountMl: Math.round((n * 3 * 236.6) / 9) },
    { name: "Garlic Cloves", amount: `${n}`, note: "1 clove per pint jar (1/2 clove per half-pint)." },
    { name: "Canning or Pickling Salt", amount: perJarSpoons(n, 1 / 2), note: "1/2 teaspoon per pint jar (1/4 teaspoon per half-pint). Not iodized table salt, and not flake salt such as kosher." },
  ];
  const steps = canningSteps({
    jarCount: n,
    jarSizeWord: "pint",
    tooLittle: tooLittle ? tooLittleStep(GRAMS_PER_PINT, "pint jar") : null,
    headspace: "1/2 inch (1.25 cm)",
    bands: PICKLE_BANDS(5, 10, 15),
    prepSteps: [
      `Wash the peppers, cut them into quarters, remove the cores and seeds, and cut away any blemishes. Slice the peppers into strips.`,
      `Boil the sugar, vinegar and water together for 1 minute. Add the pepper strips and bring back to a boil.`,
      `Put 1 clove of garlic and 1/2 teaspoon of salt in each hot pint jar (half of each in a half-pint jar). Add the pepper strips and cover them with the hot vinegar mixture, leaving 1/2 inch (1.25 cm) of headspace. This is a hot pack.`,
      ...leftoverStep(leftover, GRAMS_PER_PINT),
    ],
  });
  return {
    title: "Pickled Bell Peppers (Water-Bath Canned)",
    method: "water-bath",
    jarSize: "pint",
    jarSizeMl: 473,
    jarCount: n,
    servings: 6 * n,
    ingredients,
    equipment: VEG_CANNING_EQUIPMENT(n, "pint"),
    steps,
    storage: SHELF_STORAGE,
    shelfLife: SHELF_LIFE,
    safetyNote:
      "This is the tested National Center for Home Food Preservation Pickled Bell Peppers recipe, divided by its yield of 9 pints so each jar keeps the tested proportions. Keep the vinegar, water, sugar and salt exactly as written, and do not shorten the processing time. Use vinegar labelled 5% acidity. The same time applies to half-pint and pint jars.",
    totalWeightGrams: totalWeight,
  };
}

// NCHFP "Pickled Cauliflower or Brussel Sprouts": 12 cups 1- to 2-inch florets, 4 cups 5% white vinegar,
// 2 cups sugar, 2 cups thinly sliced onions, 1 cup diced sweet red peppers, 2 tbsp mustard seed,
// 1 tbsp celery seed, 1 tsp turmeric, 1 tsp hot red pepper flakes. Yield about 9 half-pints.
// Blanch cauliflower 3 minutes in salt water (4 tsp canning salt per gallon). Hot pack, half-pints or
// pints: 10 / 15 / 20. NCHFP gives no weight for the florets; 100 g per cup is an estimate used only to
// count jars.
function generatePickledCauliflowerRecipe(totalWeight: number): RecipeOutput {
  const FLORET_G_PER_CUP = 100;
  const CUPS_PER_HALF_PINT = 12 / 9;
  const GRAMS_PER_JAR = CUPS_PER_HALF_PINT * FLORET_G_PER_CUP;
  const { jarCount, tooLittle, leftover } = jarCountFor(totalWeight, GRAMS_PER_JAR);
  const n = jarCount;
  const ingredients: RecipeIngredient[] = [
    { name: "Cauliflower Florets, 1 to 2 inches (2.5 to 5 cm)", amount: `${perJarCups(n, CUPS_PER_HALF_PINT)} (about ${formatGrams(n * GRAMS_PER_JAR)})`, amountGrams: n * GRAMS_PER_JAR, note: "About 1 1/3 cups per half-pint jar. The weight is an estimate; measure the florets in cups." },
    { name: "White Vinegar, 5% Acidity", amount: perJarCups(n, 4 / 9), amountMl: Math.round((n * 4 * 236.6) / 9), note: "Part of the tested recipe. Do not reduce it." },
    { name: "Granulated Sugar", amount: perJarCups(n, 2 / 9), note: "Part of the tested recipe." },
    { name: "Onions, thinly sliced", amount: perJarCups(n, 2 / 9) },
    { name: "Sweet Red Peppers, diced", amount: perJarCups(n, 1 / 9) },
    { name: "Mustard Seed", amount: perJarSpoons(n, 2 / 3) },
    { name: "Celery Seed", amount: perJarSpoons(n, 1 / 3) },
    { name: "Turmeric", amount: perJarSpoons(n, 1 / 9) },
    { name: "Hot Red Pepper Flakes", amount: perJarSpoons(n, 1 / 9) },
    { name: "Canning or Pickling Salt, for the blanching water", amount: "4 tsp per gallon of water", note: "Only for the 3-minute blanch." },
  ];
  const steps = canningSteps({
    jarCount: n,
    jarSizeWord: "half-pint",
    tooLittle: tooLittle ? tooLittleStep(GRAMS_PER_JAR, "half-pint jar") : null,
    headspace: "1/2 inch (1.25 cm)",
    bands: PICKLE_BANDS(10, 15, 20),
    prepSteps: [
      `Wash the cauliflower and cut it into 1- to 2-inch (2.5 to 5 cm) florets, removing stems and blemishes. Boil the florets in salted water (4 teaspoons of canning salt per gallon) for 3 minutes. Drain and cool.`,
      `Combine the vinegar, sugar, onion, red pepper and spices in a large saucepan. Bring to a boil and simmer 5 minutes.`,
      `Share the onion and diced pepper among the hot jars. Fill the jars with florets and the hot pickling solution, leaving 1/2 inch (1.25 cm) of headspace. This is a hot pack.`,
      ...leftoverStep(leftover, GRAMS_PER_JAR),
    ],
  });
  return {
    title: "Pickled Cauliflower (Water-Bath Canned)",
    method: "water-bath",
    jarSize: "half-pint",
    jarSizeMl: 237,
    jarCount: n,
    servings: 3 * n,
    ingredients,
    equipment: VEG_CANNING_EQUIPMENT(n, "half-pint"),
    steps,
    storage: SHELF_STORAGE,
    shelfLife: SHELF_LIFE,
    safetyNote:
      "This is the tested National Center for Home Food Preservation Pickled Cauliflower or Brussels Sprouts recipe, divided by its yield of 9 half-pints so each jar keeps the tested proportions. Keep the vinegar and the other ingredients exactly as written, and do not shorten the processing time. Use vinegar labelled 5% acidity. The same time applies to half-pint and pint jars.",
    totalWeightGrams: totalWeight,
  };
}

// NCHFP "Quick Fresh-Pack Dill Pickles": 8 lb 3- to 5-inch pickling cucumbers; soak in 2 gal water with 3/4 cup
// canning or pickling salt for 12 hours, drain; brine of 1 1/2 qt 5% vinegar, 1/2 cup salt, 1/4 cup sugar,
// 2 qt water, 2 tbsp whole mixed pickling spice (tied in cloth); per pint 1 tsp mustard seed and 1 1/2 heads
// fresh dill (or 1 1/2 tsp dill seed). Yield 7 to 9 pints (8 used). Raw pack, pints: 10 / 15 / 20.
function generateFreshPackDillPicklesRecipe(totalWeight: number): RecipeOutput {
  const GRAMS_PER_PINT = (8 * POUND) / 8;
  const { jarCount, tooLittle, leftover } = jarCountFor(totalWeight, GRAMS_PER_PINT);
  const n = jarCount;
  const ingredients: RecipeIngredient[] = [
    { name: "Pickling Cucumbers, 3 to 5 inches (7.5 to 12.5 cm) long", amount: formatGrams(n * GRAMS_PER_PINT), amountGrams: n * GRAMS_PER_PINT, note: "About 1 pound (454 g) per pint jar." },
    { name: "For the 12-hour soak: Water", amount: `${n} quart${n > 1 ? "s" : ""}`, note: "1 quart per pound of cucumbers." },
    { name: "For the 12-hour soak: Canning or Pickling Salt", amount: perJarSpoons(n, 4.5), note: "1 1/2 tablespoons per pound. Not iodized table salt, and not flake salt such as kosher." },
    { name: "For the brine: Vinegar, 5% Acidity", amount: perJarCups(n, 3 / 4), amountMl: Math.round(n * 0.75 * 236.6), note: "Part of the tested recipe. Do not reduce it." },
    { name: "For the brine: Water", amount: perJarCups(n, 1) },
    { name: "For the brine: Canning or Pickling Salt", amount: perJarSpoons(n, 3) },
    { name: "For the brine: Sugar", amount: perJarSpoons(n, 2) },
    { name: "Whole Mixed Pickling Spice", amount: perJarSpoons(n, 3 / 4), note: "Tie it in a clean white cloth and simmer it in the brine." },
    { name: "Mustard Seed", amount: `${n} tsp`, note: "1 teaspoon per pint jar." },
    { name: "Fresh Dill Heads, or Dill Seed", amount: `${perHalves(n * 3)} heads, or ${perHalves(n * 3)} tsp seed`, note: "1 1/2 heads (or 1 1/2 teaspoons of seed) per pint jar." },
  ];
  const steps = canningSteps({
    jarCount: n,
    jarSizeWord: "pint",
    tooLittle: tooLittle ? tooLittleStep(GRAMS_PER_PINT, "pint jar") : null,
    headspace: "1/2 inch (1.25 cm)",
    bands: PICKLE_BANDS(10, 15, 20),
    prepSteps: [
      `Wash the cucumbers. Cut a 1/16-inch (1.5 mm) slice off the blossom end and discard it, but leave 1/4 inch (6 mm) of stem attached.`,
      `Dissolve the soak salt in the soak water, pour it over the cucumbers, and leave them for 12 hours. Drain.`,
      `Combine the brine vinegar, brine salt, sugar and brine water. Add the pickling spice tied in a clean white cloth. Heat to boiling.`,
      `Fill the hot jars with cucumbers. Add 1 teaspoon of mustard seed and 1 1/2 heads of fresh dill (or 1 1/2 teaspoons of dill seed) to each pint. Cover with the boiling pickling solution, leaving 1/2 inch (1.25 cm) of headspace. This is a raw pack.`,
      ...leftoverStep(leftover, GRAMS_PER_PINT),
    ],
  });
  return {
    title: "Quick Fresh-Pack Dill Pickles (Water-Bath Canned)",
    method: "water-bath",
    jarSize: "pint",
    jarSizeMl: 473,
    jarCount: n,
    servings: 8 * n,
    ingredients,
    equipment: VEG_CANNING_EQUIPMENT(n, "pint"),
    steps,
    storage: SHELF_STORAGE,
    shelfLife: SHELF_LIFE,
    safetyNote:
      "This is the tested National Center for Home Food Preservation Quick Fresh-Pack Dill Pickles recipe, divided by its yield of 8 pints so each jar keeps the tested proportions. Keep the vinegar, water and salt exactly as written, and do not shorten the processing time. Use vinegar labelled 5% acidity. Pints are the tested size here.",
    totalWeightGrams: totalWeight,
  };
}

// NCHFP "Whole or Halved Tomatoes (packed in water)" with "Tomato acidification directions": average 13 lb
// per 9 pints (about 1.4 lb a pint). Add 1 tablespoon bottled lemon or lime juice from concentrate (or 1/4 tsp
// citric acid, or 2 tbsp 5% vinegar) to each pint. Salt 1 tsp per quart, optional. Raw or hot pack, boiling
// water canner, pints: 40 min at 0-1,000 ft, 45 at 1,001-3,000, 50 at 3,001-6,000, 55 above 6,000.
function generateWholeTomatoesRecipe(totalWeight: number): RecipeOutput {
  const GRAMS_PER_PINT = (13 * POUND) / 9;
  const { jarCount, tooLittle, leftover } = jarCountFor(totalWeight, GRAMS_PER_PINT);
  const n = jarCount;
  const ingredients: RecipeIngredient[] = [
    { name: "Cherry Tomatoes, whole", amount: formatGrams(n * GRAMS_PER_PINT), amountGrams: n * GRAMS_PER_PINT, note: "About 1 1/2 pounds (655 g) per pint jar, from NCHFP's average of 13 pounds for 9 pints." },
    { name: "Bottled Lemon or Lime Juice, from concentrate", amount: `${n} tablespoon${n > 1 ? "s" : ""}`, note: "1 tablespoon per pint jar, added to the jar before the tomatoes. This acid is required. Do not leave it out. Use bottled juice, not fresh. Alternatives per pint: 1/4 teaspoon citric acid, or 2 tablespoons of 5% vinegar." },
    { name: "Boiling Water", amount: "enough to cover", note: "Heat it before you fill the jars." },
    { name: "Salt (optional)", amount: perJarSpoons(n, 1 / 2), note: "1 teaspoon per quart, so 1/2 teaspoon per pint." },
  ];
  const steps = canningSteps({
    jarCount: n,
    jarSizeWord: "pint",
    tooLittle: tooLittle ? tooLittleStep(GRAMS_PER_PINT, "pint jar") : null,
    headspace: "1/2 inch (1.25 cm)",
    bands: [
      { label: "0 to 1,000 ft", minutes: 40 },
      { label: "1,001 to 3,000 ft", minutes: 45 },
      { label: "3,001 to 6,000 ft", minutes: 50 },
      { label: "above 6,000 ft", minutes: 55 },
    ],
    prepSteps: [
      `Wash the tomatoes. Dip them in boiling water for 30 to 60 seconds, until the skins split, then dip them in cold water. Slip off the skins and remove the cores. Leave them whole.`,
      `Put 1 tablespoon of bottled lemon or lime juice in each hot pint jar, and the optional salt.`,
      `Raw pack: fill the hot jars with the prepared tomatoes and cover them with boiling water. Hot pack: boil the tomatoes gently in enough water to cover them for 5 minutes, fill the jars with the hot tomatoes, and add the cooking liquid. Either way, leave 1/2 inch (1.25 cm) of headspace.`,
      ...leftoverStep(leftover, GRAMS_PER_PINT),
    ],
  });
  return {
    title: "Whole Tomatoes Packed in Water (Water-Bath Canned)",
    method: "water-bath",
    jarSize: "pint",
    jarSizeMl: 473,
    jarCount: n,
    servings: 3 * n,
    ingredients,
    equipment: VEG_CANNING_EQUIPMENT(n, "pint"),
    steps,
    storage: SHELF_STORAGE,
    shelfLife: SHELF_LIFE,
    safetyNote:
      "This is the tested National Center for Home Food Preservation recipe for whole tomatoes packed in water, with its acidification directions. Tomatoes are only borderline acid, so the bottled lemon or lime juice (or citric acid, or vinegar) in each jar is required: add it before you fill the jar, and never skip it or use fresh juice. These are canned tomatoes, not pickled tomatoes. Do not shorten the processing time.",
    totalWeightGrams: totalWeight,
  };
}

const TESTED_VEGETABLE_WATER_BATH: Record<string, (totalWeight: number) => RecipeOutput> = {
  "green-bean": generateDilledBeansRecipe,
  "bell-pepper": generatePickledPeppersRecipe,
  cauliflower: generatePickledCauliflowerRecipe,
  cucumber: generateFreshPackDillPicklesRecipe,
  "cherry-tomato": generateWholeTomatoesRecipe,
};

// Shown when the crops chosen cannot be canned together: each vegetable has its own tested recipe and time.
function generateCanOneAtATimeNotice(entries: HarvestEntry[]): RecipeOutput {
  const total = entries.reduce((sum, e) => sum + e.weightGrams, 0);
  return {
    title: "Can one crop at a time",
    method: "water-bath",
    jarSize: "pint",
    jarSizeMl: 473,
    jarCount: 0,
    servings: 0,
    ingredients: [],
    equipment: [],
    steps: [
      "Each vegetable has its own tested recipe and processing time, and fruit jam has another. A mixed jar has no tested time, so this calculator will not make one.",
      "Pick one crop on its own to get its tested recipe. Anything you do not have enough of for a whole jar works well as a Quick Pickle, which keeps in the fridge.",
    ],
    storage: "",
    shelfLife: "",
    safetyNote:
      "Home canning is only safe when the recipe, jar size and processing time are tested together. Mixing crops in one canned jar has no tested time.",
    totalWeightGrams: total,
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

  // For fruit jams: tested proportions for jam made without added pectin
  // (National Center for Home Food Preservation, adapted from the USDA Complete Guide to Home Canning).
  // Berries: equal volumes of crushed fruit and sugar, no lemon juice.
  // Peaches: 4-5 cups sugar and 2 Tbsp lemon juice per 5 1/2 to 6 cups crushed fruit.
  const isFruit = FRUIT_IDS.includes(entries[0].produceId);

  let ingredients: RecipeIngredient[];
  let steps: string[];
  let safetyNote: string;

  if (isFruit) {
    const isPeach = entries[0].produceId === "peach";
    const CRUSHED_CUP_G = 250; // rough weight of 1 cup of crushed fruit
    const SUGAR_CUP_G = 200; // 1 cup of granulated sugar
    const fruitCups = roundTo(totalWeight / CRUSHED_CUP_G, 1);
    const sugarCups = roundTo(fruitCups * (isPeach ? 0.8 : 1), 1);
    const sugarGrams = roundTo(sugarCups * SUGAR_CUP_G, 0);
    const lemonTsp = isPeach ? roundTo(fruitCups * 1, 1) : 0;
    const fruitJar: "half-pint" | "pint" = totalWeight > 220 ? "pint" : "half-pint";
    const fruitJarMl = getJarMl(fruitJar);
    // Tested recipes yield roughly 0.8 ml of jam per gram of fruit (3-4 half-pints from ~4 cups of crushed fruit).
    const jarCount = Math.max(1, Math.ceil((totalWeight * 0.8) / (fruitJarMl * 0.95)));
    const jarWord = `${jarCount} ${fruitJar} Mason jar${jarCount > 1 ? "s" : ""}`;
    const prep = isPeach
      ? "Wash the peaches, then peel, pit and crush them."
      : entries[0].produceId === "blackberry" || entries[0].produceId === "raspberry"
        ? "Wash the berries and crush them. If you would rather have seedless jam, heat the crushed berries until soft and press them through a sieve or food mill first."
        : "Wash the berries, take off the caps, and crush them.";

    ingredients = [
      {
        name: "Your Harvest",
        amount: formatGrams(totalWeight),
        amountGrams: totalWeight,
        note: `${produceNames}, crushed. Measure the crushed fruit in cups (about ${fruitCups} cups here).`,
      },
      {
        name: "Granulated Sugar",
        amount: `${sugarCups} cups (about ${formatGrams(sugarGrams)})`,
        amountGrams: sugarGrams,
        note: isPeach
          ? "Tested proportion: 4 to 5 cups of sugar for every 5½ to 6 cups of crushed peaches. Do not reduce it."
          : "Tested proportion: the same number of cups of sugar as crushed fruit. Do not reduce it.",
      },
      ...(isPeach
        ? [
            {
              name: "Bottled Lemon Juice",
              amount: `${lemonTsp} tsp`,
              note: "Tested proportion: 2 tablespoons for every 5½ to 6 cups of crushed peaches.",
            } as RecipeIngredient,
          ]
        : []),
    ];

    steps = [
      `Sterilize your ${jarWord} and lids: submerge in boiling water for 10 minutes, then keep hot until ready to fill. Put 2 small plates in the freezer for the set test.`,
      `${prep} Measure the crushed fruit in cups.`,
      `Put the crushed fruit in a wide, heavy-bottomed saucepan. Add the sugar${isPeach ? " and lemon juice" : ""}, using the amounts above, and stir well. If your measured cups differ from the estimate above, go by your cups and keep the same sugar ratio.`,
      `Bring slowly to a boil, stirring until the sugar dissolves. Then boil hard, stirring rapidly and constantly, until the jam reaches 220°F at sea level (at altitude, use 218°F at 1,000 ft, 216°F at 2,000 ft, 214°F at 3,000 ft, 212°F at 4,000 ft, 211°F at 5,000 ft, 209°F at 6,000 ft), or until a spoonful on a frozen plate wrinkles when you push it. Hot jam looks runnier than it will be once cool, so stop when it passes the test.`,
      `Take the pot off the heat and skim off the foam. Ladle the hot jam into the hot jars, leaving 1/4 inch (6 mm) of headspace. Wipe the rims clean with a damp cloth.`,
      `Put the lids on and screw the bands on until fingertip-tight.`,
      `Process in a boiling water canner, with the jars covered by 1 to 2 inches of water: 5 minutes at 0 to 1,000 ft, 10 minutes at 1,001 to 6,000 ft, 15 minutes above 6,000 ft. Start the timer when the water is at a full rolling boil.`,
      `Turn off the heat, remove the canner lid, and wait 5 minutes. Lift the jars out without tilting them and set them on a towel. Do NOT retighten the lid. Let it cool undisturbed for 12 to 24 hours.`,
      `Check each seal: press the center of the lid. It should be firm and not flex. If it flexes, keep that jar in the fridge and use it within 3 weeks. Label with the date.`,
      `These proportions are tested for about 4 to 6 cups of crushed fruit per batch. If you have more fruit than that, cook it in separate batches rather than one big pot.`,
    ];

    safetyNote =
      "These are the tested proportions and processing times for jam made without added pectin, from the National Center for Home Food Preservation. The sugar is part of the preservation, so do not reduce it, and do not shorten the processing time. Cook one type of fruit per batch. If you would rather skip the canner, the same jam keeps about 3 weeks in the fridge or up to a year in the freezer.";

    return {
      title: `Water-Bath Canned ${produceNames}`,
      method: "water-bath",
      jarSize: fruitJar,
      jarSizeMl: fruitJarMl,
      jarCount,
      servings: fruitJar === "half-pint" ? 4 : 8,
      ingredients,
      equipment: [
        `${jarWord} with 2-piece lids`,
        "Boiling water canner (or a large, deep pot with a lid and rack)",
        "Jar lifter or tongs",
        "Canning funnel",
        "Non-metallic spatula or chopstick",
        "Kitchen scale and measuring cups",
        "Candy thermometer (optional) and 2 small plates",
        "Cutting board & knife",
      ],
      steps,
      storage:
        "Store sealed jars in a cool, dark, dry place (50-70°F / 10-21°C). Once opened, refrigerate and use within 3 weeks.",
      shelfLife:
        "For best quality, use within 1 year. A jar with an intact seal and no signs of mold or yeast is safe to eat.",
      safetyNote,
      totalWeightGrams: totalWeight,
    };
  }

  // Vegetables never reach this function: generateRecipe sends them to the tested NCHFP recipes.
  throw new Error("generateWaterBathRecipe handles fruit jam only");
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
    case "ferment": {
      if (isCucumberOnly(entries)) return generateCucumberFermentRecipe(entries);
      const fermentRecipe = generateFermentRecipe(entries);
      if (entries.some((e) => e.produceId === "cucumber")) {
        fermentRecipe.safetyNote +=
          " Cucumber pickles have their own tested recipe (the National Center for Home Food Preservation dill pickles). Ferment cucumbers in a separate jar and choose them on their own.";
      }
      return fermentRecipe;
    }
    case "water-bath": {
      if (entries.every((e) => FRUIT_IDS.includes(e.produceId))) return generateWaterBathRecipe(entries);
      const first = entries[0].produceId;
      const tested = TESTED_VEGETABLE_WATER_BATH[first];
      if (tested && entries.every((e) => e.produceId === first)) {
        return tested(entries.reduce((sum, e) => sum + e.weightGrams, 0));
      }
      return generateCanOneAtATimeNotice(entries);
    }
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
    tagline: "Gut-friendly probiotics from salt and time",
    description:
      "The ancient art of preservation using only salt, water, and time. Lactic acid bacteria naturally present on your vegetables create tangy, complex flavors while producing beneficial probiotics. No heat, no canner, just the vegetables doing the work. Cucumber pickles follow the tested National Center for Home Food Preservation dill pickle recipe, which includes a little vinegar and takes 3 to 4 weeks. The most rewarding method for patient apartment homesteaders.",
    timeRange: "15 min prep + 4 days to 4 weeks fermenting",
    difficulty: "Medium",
    equipmentSummary: "Mason jar, fermentation weight, kitchen scale",
  },
  {
    id: "water-bath",
    name: "Water-Bath Can",
    tagline: "Shelf-stable for months, pantry-ready",
    description:
      "The real deal — properly canned preserves that sit safely on your pantry shelf for up to a year. A boiling water bath kills spoilage organisms and creates a vacuum seal. Requires a large pot (or canner) and careful attention to acidity levels, but the payoff is a pantry full of your own preserves. Every recipe here follows a tested National Center for Home Food Preservation recipe, one crop at a time, in whole jars.",
    timeRange: "45-60 min total",
    difficulty: "Advanced",
    equipmentSummary: "Large pot/canner, jar lifter, canning funnel",
  },
];

export function getMethodInfo(method: PreservingMethod): MethodInfo {
  return METHOD_INFO.find((m) => m.id === method)!;
}