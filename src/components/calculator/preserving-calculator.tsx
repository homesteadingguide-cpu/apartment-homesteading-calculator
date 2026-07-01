'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Leaf,
  FlaskConical,
  Droplets,
  ChefHat,
  Plus,
  Minus,
  RotateCcw,
  AlertTriangle,
  Clock,
  Gauge,
  Package,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Scale,
  Timer,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Download,
  Trash2,
  FolderOpen,
  FileText,
  Printer,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  PRODUCE,
  METHOD_INFO,
  generateRecipe,
  type PreservingMethod,
  type HarvestEntry,
  type RecipeOutput,
  type ProduceItem,
} from '@/lib/preserving-data';
import {
  useRecipeStore,
  downloadRecipeText,

  type SavedRecipe,
} from '@/hooks/use-recipe-store';
import ShelfLifeTracker from '@/components/calculator/shelf-life-tracker';

// ---- Sub-components ----

function MethodCard({
  method,
  selected,
  onClick,
}: {
  method: (typeof METHOD_INFO)[number];
  selected: boolean;
  onClick: () => void;
}) {
  const icons = { 'quick-pickle': Droplets, ferment: FlaskConical, 'water-bath': ChefHat };
  const Icon = icons[method.id];
  const diffColor = { Easy: 'bg-[#e8f0e6] text-[#1e3d1a]', Medium: 'bg-[#e8f0e6] text-amber-800', Advanced: 'bg-rose-100 text-rose-800' }[method.difficulty];

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-[#2D5A27] bg-[#f2f7f0]/80 shadow-md shadow-[#e8f0e6]'
          : 'border-[#d6d3c8] bg-white hover:border-[#b5b0a3] hover:shadow-sm'
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-[#f2f7f0]0 text-white rounded-full p-1"
        >
          <CheckCircle2 className="w-4 h-4" />
        </motion.div>
      )}
      <div className="flex items-start gap-3">
        <div
          className={`rounded-xl p-2.5 ${
            selected ? 'bg-[#f2f7f0]0 text-white' : 'bg-[#F4F1EA] text-[#6b6559]'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-[#222] text-sm sm:text-base">{method.name}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${diffColor}`}>
              {method.difficulty}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#6b6559] leading-relaxed">{method.tagline}</p>
          <p className="text-xs text-[#a8a29e] mt-2 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {method.timeRange}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

function HarvestInput({
  entries,
  onAdd,
  onRemove,
  onUpdateWeight,
  availableProduce,
}: {
  entries: HarvestEntry[];
  onAdd: (produceId: string) => void;
  onRemove: (index: number) => void;
  onUpdateWeight: (index: number, weight: number) => void;
  availableProduce: ProduceItem[];
}) {
  const [selectedProduce, setSelectedProduce] = useState<string>('');

  const handleAdd = () => {
    if (selectedProduce) {
      onAdd(selectedProduce);
      setSelectedProduce('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Select value={selectedProduce} onValueChange={setSelectedProduce}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Choose your harvest..." />
            </SelectTrigger>
            <SelectContent>
              {availableProduce.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <span className="mr-2">{p.emoji}</span>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleAdd}
          disabled={!selectedProduce}
          className="bg-[#2D5A27] hover:bg-emerald-700 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-[#a8a29e]"
          >
            <Leaf className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Add your harvest to get started</p>
            <p className="text-xs mt-1">Select what you grew and how much you picked</p>
          </motion.div>
        ) : (
          <motion.div layout className="space-y-2">
            {entries.map((entry, i) => {
              const produce = PRODUCE.find((p) => p.id === entry.produceId);
              if (!produce) return null;
              return (
                <motion.div
                  key={`${entry.produceId}-${i}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="flex items-center gap-3 bg-white rounded-xl border border-[#d6d3c8] p-3"
                >
                  <span className="text-2xl">{produce.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#222] truncate">{produce.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Label className="text-xs text-[#6b6559] hidden sm:inline">g</Label>
                    <Input
                      type="number"
                      min={10}
                      max={2000}
                      value={entry.weightGrams || ''}
                      onChange={(e) => onUpdateWeight(i, Math.max(10, parseInt(e.target.value) || 0))}
                      placeholder="150"
                      className="w-20 h-9 text-center text-sm"
                    />
                    <Label className="text-xs text-[#6b6559] sm:hidden">g</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(i)}
                    className="h-8 w-8 text-[#a8a29e] hover:text-red-500 hover:bg-red-50 shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-[#6b6559] bg-amber-50 rounded-lg px-3 py-2">
          <Scale className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
          <span>
            For the best results, use a kitchen scale. The preserving ratios are calculated to the gram
            — accuracy matters for food safety, especially with fermentation.
          </span>
        </div>
      )}
    </div>
  );
}

function RecipeCard({
  recipe,
  isSaved,
  onSave,
  onExport,
  onPrint,
}: {
  recipe: RecipeOutput;
  isSaved: boolean;
  onSave: () => void;
  onExport: () => void;
  onPrint: () => void;
}) {
  const methodInfo = METHOD_INFO.find((m) => m.id === recipe.method);
  const MethodIcon = { 'quick-pickle': Droplets, ferment: FlaskConical, 'water-bath': ChefHat }[recipe.method];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Recipe Header */}
      <div className="text-center space-y-2 py-2">
        <div className="inline-flex items-center gap-2 bg-[#e8f0e6] text-[#2D5A27] text-xs font-medium px-3 py-1 rounded-full">
          <MethodIcon className="w-3.5 h-3.5" />
          {methodInfo?.name}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#222]">{recipe.title}</h2>
        <p className="text-sm text-[#6b6559]">
          {recipe.jarSize === 'half-pint' ? 'Half-Pint' : 'Pint'} Jar ({recipe.jarSizeMl} ml) — Serves {recipe.servings}
        </p>
      </div>

      {/* Save / Share Actions — hidden on print */}
      <div className="flex flex-col items-center gap-2 print-hide">
        <Button
          variant={isSaved ? 'outline' : 'default'}
          onClick={onSave}
          className={
            isSaved
              ? 'border-[#2D5A27]/40 text-[#2D5A27] bg-[#f2f7f0] hover:bg-[#e8f0e6] w-full sm:w-auto'
              : 'bg-[#2D5A27] hover:bg-emerald-700 text-white w-full sm:w-auto'
          }
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4 mr-1.5" />
              Saved to My Recipes
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 mr-1.5" />
              Save to My Recipes
            </>
          )}
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="text-[#6b6559] hover:text-[#222] hover:bg-[#F4F1EA] text-xs h-8 px-2.5"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Download</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrint}
            className="text-[#6b6559] hover:text-[#222] hover:bg-[#F4F1EA] text-xs h-8 px-2.5 print-hide"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Print</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print-hide">
        <MiniStat icon={Scale} label="Harvest" value={recipe.ingredients[0]?.amount ?? '-'} />
        <MiniStat icon={Package} label="Jar Size" value={recipe.jarSize === 'half-pint' ? 'Half-Pint' : 'Pint'} />
        <MiniStat icon={Timer} label="Time" value={methodInfo?.timeRange.split('+')[0]?.trim() ?? '-'} />
        <MiniStat icon={Gauge} label="Difficulty" value={methodInfo?.difficulty} />
      </div>

      <Tabs defaultValue="recipe" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-[#F4F1EA]">
          <TabsTrigger value="recipe" className="text-xs sm:text-sm">
            <ChefHat className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Recipe
          </TabsTrigger>
          <TabsTrigger value="steps" className="text-xs sm:text-sm">
            <BookOpen className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Steps
          </TabsTrigger>
          <TabsTrigger value="storage" className="text-xs sm:text-sm">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Storage & Safety
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipe">
          <Card className="border-[#d6d3c8] shadow-sm mt-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2D5A27]" />
                Ingredients — Scaled for {recipe.jarSize === 'half-pint' ? 'Half-Pint' : 'Pint'} Jar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-3 pb-3 border-b border-[#d6d3c8]/60 last:border-0 last:pb-0"
                  >
                    <span className="font-semibold text-[#2D5A27] text-sm min-w-[70px] shrink-0">
                      {ing.amount}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-[#222]">{ing.name}</p>
                      {ing.note && (
                        <p className="text-xs text-[#a8a29e] mt-0.5">{ing.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#d6d3c8] shadow-sm mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4 text-[#6b6559]" />
                Equipment Needed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.equipment.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#444]">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {eq}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps">
          <Card className="border-[#d6d3c8] shadow-sm mt-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Step-by-Step Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.steps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#e8f0e6] text-[#2D5A27] flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[#444] leading-relaxed pt-0.5">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-4 mt-3">
            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  Storage Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#444] leading-relaxed">{recipe.storage}</p>
              </CardContent>
            </Card>

            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#2D5A27]" />
                  Shelf Life
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#444] leading-relaxed">{recipe.shelfLife}</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  Safety Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-800/80 leading-relaxed">{recipe.safetyNote}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Print-only: Notes section for handwriting */}
      <div className="print-only-notes">
        <div className="print-section-title">Notes</div>
        <div className="print-meta-row">
          <span>Date made: _______________</span>
          <span>Batch #: _______________</span>
        </div>
        <div className="print-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="print-line" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#d6d3c8] p-3 text-center">
      <Icon className="w-4 h-4 mx-auto text-[#a8a29e] mb-1" />
      <p className="text-xs text-[#6b6559]">{label}</p>
      <p className="text-sm font-semibold text-[#222] mt-0.5">{value}</p>
    </div>
  );
}

// ---- Saved Recipes Drawer ----

function SavedRecipesDrawer({
  open,
  onOpenChange,
  recipes,
  onLoad,
  onDelete,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: SavedRecipe[];
  onLoad: (recipe: SavedRecipe) => void;
  onDelete: (id: string) => void;
}) {
  const methodIcons: Record<string, React.ElementType> = {
    'quick-pickle': Droplets,
    ferment: FlaskConical,
    'water-bath': ChefHat,
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#F4F1EA]/50">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2 text-[#222]">
            <BookmarkCheck className="w-5 h-5 text-[#2D5A27]" />
            My Saved Recipes
          </SheetTitle>
          <SheetDescription>
            Click any recipe to load it back into the calculator. Tweak the weights or switch methods anytime.
          </SheetDescription>
        </SheetHeader>

        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#a8a29e]">
            <Bookmark className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm font-medium">No saved recipes yet</p>
            <p className="text-xs mt-1 text-center max-w-[240px]">
              Generate a recipe, then hit &ldquo;Save to My Recipes&rdquo; to keep it here for later.
            </p>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {recipes.map((saved) => {
              const Icon = methodIcons[saved.method] ?? Leaf;
              const date = new Date(saved.savedAt);
              const dateStr = date.toLocaleDateString('en-NZ', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <motion.div
                  key={saved.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-[#d6d3c8] p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-[#e8f0e6] rounded-lg p-2 mt-0.5 shrink-0">
                      <Icon className="w-4 h-4 text-[#2D5A27]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#222] truncate">{saved.name}</p>
                      <p className="text-[11px] text-[#a8a29e] mt-0.5">
                        {saved.harvestEntries
                          .map((e) => {
                            const p = PRODUCE.find((pr) => pr.id === e.produceId);
                            return `${e.weightGrams}g ${p?.name ?? e.produceId}`;
                          })
                          .join(' + ')}
                      </p>
                      <p className="text-[10px] text-[#a8a29e] mt-1">{dateStr}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={() => {
                        onLoad(saved);
                        onOpenChange(false);
                      }}
                      className="flex-1 bg-[#2D5A27] hover:bg-emerald-700 text-white text-xs h-8"
                    >
                      <Scale className="w-3 h-3 mr-1" />
                      Load & Tweak
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadRecipeText(saved.recipe)}
                      className="text-xs h-8 border-stone-300 text-[#555]"
                    >
                      <FileText className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(saved.id)}
                      className="text-xs h-8 text-[#a8a29e] hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ---- Main Calculator ----

export default function PreservingCalculator({
  initialMethod,
  initialEntries,
}: {
  initialMethod?: PreservingMethod | null;
  initialEntries?: HarvestEntry[] | null;
}) {
  const [harvestEntries, setHarvestEntries] = useState<HarvestEntry[]>(
    () => initialEntries ?? []
  );
  const [selectedMethod, setSelectedMethod] = useState<PreservingMethod | null>(
    () => initialMethod ?? null
  );

  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const { savedRecipes, saveRecipe, deleteRecipe, isRecipeSaved } = useRecipeStore();

  const availableProduce = useMemo(() => {
    if (!selectedMethod) return PRODUCE;
    return PRODUCE.filter((p) => {
      if (selectedMethod === 'quick-pickle') return p.quickPickle;
      if (selectedMethod === 'ferment') return p.ferment;
      if (selectedMethod === 'water-bath') return p.waterBath;
      return true;
    });
  }, [selectedMethod]);

  const recipe: RecipeOutput | null = useMemo(() => {
    if (selectedMethod && harvestEntries.length > 0 && harvestEntries.every((e) => e.weightGrams > 0)) {
      return generateRecipe(harvestEntries, selectedMethod);
    }
    return null;
  }, [harvestEntries, selectedMethod]);

  const handleAddProduce = useCallback(
    (produceId: string) => {
      setHarvestEntries((prev) => [...prev, { produceId, weightGrams: 150 }]);
    },
    []
  );

  const handleRemoveProduce = useCallback((index: number) => {
    setHarvestEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpdateWeight = useCallback((index: number, weight: number) => {
    setHarvestEntries((prev) => prev.map((e, i) => (i === index ? { ...e, weightGrams: weight } : e)));
  }, []);

  const handleMethodSelect = useCallback((method: PreservingMethod) => {
    setSelectedMethod(method);
    setHarvestEntries((prev) => {
      return prev.filter((entry) => {
        const produce = PRODUCE.find((p) => p.id === entry.produceId);
        if (!produce) return false;
        if (method === 'quick-pickle') return produce.quickPickle;
        if (method === 'ferment') return produce.ferment;
        if (method === 'water-bath') return produce.waterBath;
        return true;
      });
    });
  }, []);

  const handleReset = useCallback(() => {
    setHarvestEntries([]);
    setSelectedMethod(null);
  }, []);

  const handleSave = useCallback(() => {
    if (!recipe || !selectedMethod) return;
    saveRecipe(selectedMethod, harvestEntries, recipe);
    setSaveToast('Recipe saved!');
    setTimeout(() => setSaveToast(null), 2000);
  }, [recipe, selectedMethod, harvestEntries, saveRecipe]);

  const handleExport = useCallback(() => {
    if (!recipe) return;
    downloadRecipeText(recipe);
  }, [recipe]);


  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleLoadSaved = useCallback((saved: SavedRecipe) => {
    setSelectedMethod(saved.method);
    setHarvestEntries(
      saved.harvestEntries.map((e) => ({ ...e }))
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const canGenerate = selectedMethod !== null && harvestEntries.length > 0 && harvestEntries.every((e) => e.weightGrams > 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f2f7f0]/60 via-white to-[#e8f0e6]/40" data-page="preserving">
      {/* Sub-header with page-specific actions */}
      <div className="bg-white/50 border-b border-[#d6d3c8]/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSavedDrawerOpen(true)}
            className="text-[#6b6559] hover:text-[#2D5A27] hover:bg-[#f2f7f0] text-xs relative"
          >
            <FolderOpen className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">My Recipes</span>
            {savedRecipes.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f2f7f0]0 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {savedRecipes.length}
              </span>
            )}
          </Button>
          {(harvestEntries.length > 0 || selectedMethod) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-[#a8a29e] hover:text-[#555] text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
        {/* Save Toast */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-[#2D5A27] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {saveToast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#222] mb-2">
            What Can You Make With{' '}
            <span className="text-[#2D5A27]">Your Harvest?</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6b6559] max-w-lg mx-auto leading-relaxed">
            Traditional canning recipes demand 10 pounds of tomatoes. But your balcony just gave you
            exactly {harvestEntries.length > 0 ? (
              <span className="font-semibold text-[#444]">
                {harvestEntries.map((e) => {
                  const p = PRODUCE.find((pr) => pr.id === e.produceId);
                  return `${e.weightGrams}g of ${p?.name ?? 'produce'}`;
                }).join(' and ')}
              </span>
            ) : (
              <span className="italic text-[#a8a29e]">your micro-harvest</span>
            )}
            . Enter it below and get a custom, safe, small-batch recipe scaled to fit a single Mason
            jar.
          </p>
        </motion.div>

        {/* Step 1: Choose Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-full bg-[#2D5A27] text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h3 className="font-semibold text-[#222]">Choose Your Preserving Method</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {METHOD_INFO.map((method) => (
              <MethodCard
                key={method.id}
                method={method}
                selected={selectedMethod === method.id}
                onClick={() => handleMethodSelect(method.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* Step 2: Add Harvest */}
        <AnimatePresence>
          {selectedMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#2D5A27] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="font-semibold text-[#222]">Add Your Harvest</h3>
                <Badge variant="secondary" className="text-[10px] bg-[#F4F1EA]">
                  {availableProduce.length} options
                </Badge>
              </div>
              <Card className="border-[#d6d3c8] shadow-sm">
                <CardContent className="pt-5">
                  <HarvestInput
                    entries={harvestEntries}
                    onAdd={handleAddProduce}
                    onRemove={handleRemoveProduce}
                    onUpdateWeight={handleUpdateWeight}
                    availableProduce={availableProduce}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Your Recipe */}
        <AnimatePresence>
          {canGenerate && recipe && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#2D5A27] text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <h3 className="font-semibold text-[#222]">Your Custom Recipe</h3>
                <Badge className="bg-[#e8f0e6] text-[#2D5A27] text-[10px] border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generated
                </Badge>
              </div>
              <Card className="border-[#d6d3c8] shadow-md overflow-hidden" data-print-recipe>
                <CardContent className="pt-5">
                  <RecipeCard
                    recipe={recipe}
                    isSaved={isRecipeSaved(recipe)}
                    onSave={handleSave}
                    onExport={handleExport}
                    onPrint={handlePrint}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shelf-Life Tracker */}
        {recipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className='mb-6 print-hide'
          >
            <ShelfLifeTracker
              method={{ 'quick-pickle': 'Quick Pickle', 'ferment': 'Lacto-Ferment', 'water-bath': 'Water-Bath Can' }[selectedMethod]}
              itemName={recipe.title}
            />
          </motion.div>
        )}

        {/* Cross-sell upsell */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 mb-4 print-hide"
        >
          <Link
            href="/bulk-buy"
            className="block rounded-xl border border-[#d6d3c8] bg-gradient-to-r from-[#f2f7f0] to-[#F4F1EA] p-4 sm:p-5 no-underline hover:shadow-md hover:border-[#2D5A27]/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#e8f0e6] rounded-lg p-2.5 shrink-0">
                <ShoppingCart className="w-5 h-5 text-[#2D5A27]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#a8a29e] uppercase tracking-wide mb-0.5">Also from Homesteading Guide</p>
                <p className="text-sm font-semibold text-[#222]">Buying in bulk? Get a custom diversion plan.</p>
                <p className="text-xs text-[#6b6559] mt-1">
                  20 lbs of carrots? 50 lbs of potatoes? Learn exactly how to process and store it all in your apartment.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2D5A27] mt-2">
                  Try the Bulk-Buy Diversion Matrix
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </main>

      {/* Saved Recipes Drawer */}
      <SavedRecipesDrawer
        open={savedDrawerOpen}
        onOpenChange={setSavedDrawerOpen}
        recipes={savedRecipes}
        onLoad={handleLoadSaved}
        onDelete={deleteRecipe}
      />
    </div>
  );
}
