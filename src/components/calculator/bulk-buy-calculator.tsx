'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ThermometerSnowflake,
  Refrigerator,
  UtensilsCrossed,
  Flame,
  Lightbulb,
  ArrowRight,
  BoxSelect,
  Weight,
  Layers,
  BookOpen,
  Info,
  Leaf,
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
  BULK_ITEMS,
  generateDiversionPlan,
  calculateTotalSpaceFootprint,
  type BulkItem,
  type DiversionPlan,
  type DiversionStep,
  type StorageLocation,
} from '@/lib/bulk-buy-data';
import {
  downloadDiversionText,
} from '@/hooks/use-recipe-store';
import ShelfLifeTracker from '@/components/calculator/shelf-life-tracker';

// Map bulk-buy ProcessingMethod names to ShelfLifeTracker's TrackerMethod names
const METHOD_NAME_MAP: Record<string, string> = {
  'Lacto-Ferment': 'Lacto-Ferment',
  'Dehydrate': 'Dehydrate',
  'Flash-Freeze': 'Flash-Freeze',
  'Quick Pickle': 'Quick Pickle',
  'Roast & Freeze': 'Roast & Freeze',
  'Make Sauce': 'Make Sauce',
  'Make Powder': 'Make Powder',
  'Blanch & Freeze': 'Blanch & Freeze',
  'Make Fruit Butter': 'Make Fruit Butter',
  'Make Jam': 'Make Jam',
  'Make Chips': 'Make Chips',
  'Caramelize & Freeze': 'Caramelize & Freeze',
  'Make Broth Base': 'Make Broth',
  'Make Pesto / Puree': 'Make Pesto',
  'Store Cool & Dark': 'Store Cool & Dark',
  'Confit': 'Confit',
};

// ---- Helpers ----

const STORAGE_ICONS: Record<StorageLocation, React.ElementType> = {
  fridge: Refrigerator,
  freezer: ThermometerSnowflake,
  pantry: Package,
  counter: Layers,
};

const STORAGE_LABELS: Record<StorageLocation, string> = {
  fridge: 'Fridge',
  freezer: 'Freezer',
  pantry: 'Pantry',
  counter: 'Counter',
};

const STORAGE_COLORS: Record<StorageLocation, string> = {
  fridge: 'bg-sky-100 text-sky-700 border-sky-200',
  freezer: 'bg-blue-100 text-blue-700 border-blue-200',
  pantry: 'bg-[#e8f0e6] text-[#2D5A27] border-amber-200',
  counter: 'bg-[#F4F1EA] text-[#444] border-[#d6d3c8]',
};

function getMethodIcon(methodName: string): React.ElementType {
  if (methodName.includes('Ferment')) return FlaskConical;
  if (methodName.includes('Dehydrate') || methodName.includes('Powder')) return Flame;
  if (methodName.includes('Freeze') || methodName.includes('Blanch')) return ThermometerSnowflake;
  if (methodName.includes('Pickle')) return UtensilsCrossed;
  if (methodName.includes('Roast') || methodName.includes('Caramelize')) return Flame;
  if (methodName.includes('Sauce') || methodName.includes('Butter') || methodName.includes('Jam') || methodName.includes('Broth')) return UtensilsCrossed;
  if (methodName.includes('Chips')) return Layers;
  if (methodName.includes('Pesto') || methodName.includes('Puree')) return UtensilsCrossed;
  if (methodName.includes('Store') || methodName.includes('Cool')) return Package;
  if (methodName.includes('Confit')) return Flame;
  return Package;
}

function FlaskConical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  );
}

// ---- Sub-components ----

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

function SpaceMathBar({ plan }: { plan: DiversionPlan }) {
  // Aggregate weight per location (more meaningful than method count)
  const locationWeight: Record<StorageLocation, number> = {
    fridge: 0,
    freezer: 0,
    pantry: 0,
    counter: 0,
  };
  const locationCubicFt: Record<StorageLocation, number> = {
    fridge: 0,
    freezer: 0,
    pantry: 0,
    counter: 0,
  };
  for (const step of plan.steps) {
    locationWeight[step.storageLocation] += step.weightLbs;
    locationCubicFt[step.storageLocation] += step.cubicFt;
  }
  const totalWeight = plan.totalWeightLbs;
  const totalCubicFt = plan.steps.reduce((s, st) => s + st.cubicFt, 0);

  const segments = (Object.entries(locationWeight) as [StorageLocation, number][])
    .filter(([, wt]) => wt > 0)
    .map(([loc, wt]) => {
      const pct = Math.round((wt / totalWeight) * 100);
      return { location: loc, weight: wt, pct, cubicFt: locationCubicFt[loc] };
    });

  const footprint = calculateTotalSpaceFootprint(plan);

  return (
    <div className="space-y-3">
      {/* Total space callout */}
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#444] bg-[#f2f7f0] rounded-lg px-3 py-2">
        <BoxSelect className="w-4 h-4 text-[#2D5A27]" />
        Total after processing: {totalCubicFt.toFixed(2)} cubic feet
      </div>

      {/* Visual bar */}
      <div className="flex rounded-lg overflow-hidden h-8">
        {segments.map((seg) => {
          const colorMap: Record<StorageLocation, string> = {
            fridge: 'bg-sky-400',
            freezer: 'bg-blue-400',
            pantry: 'bg-amber-400',
            counter: 'bg-stone-400',
          };
          return (
            <motion.div
              key={seg.location}
              initial={{ width: 0 }}
              animate={{ width: `${seg.pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`${colorMap[seg.location]} flex items-center justify-center`}
              title={`${seg.weight} lbs → ${STORAGE_LABELS[seg.location]} (${seg.cubicFt.toFixed(3)} cu ft)`}
            >
              <span className="text-white text-[10px] font-bold drop-shadow-sm hidden sm:inline">
                {STORAGE_LABELS[seg.location]}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Location breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(footprint) as [StorageLocation, string][])
          .filter(([, val]) => val !== 'None')
          .map(([loc, val]) => (
            <div key={loc} className={`rounded-lg border p-2 text-center ${STORAGE_COLORS[loc]}`}>
              {(() => { const Icon = STORAGE_ICONS[loc]; return <Icon className="w-3.5 h-3.5 mx-auto mb-0.5" />; })()}
              <p className="text-[10px] font-semibold uppercase tracking-wide">{STORAGE_LABELS[loc]}</p>
              <p className="text-[11px] mt-0.5 opacity-80 break-all">{val}</p>
              <p className="text-[9px] mt-0.5 opacity-60">
                {locationCubicFt[loc].toFixed(3)} cu ft
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

function DiversionStepCard({ step, index }: { step: DiversionStep; index: number }) {
  const MethodIcon = getMethodIcon(step.method.name);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-[#d6d3c8] shadow-sm overflow-hidden">
        <div className="flex items-stretch">
          {/* Left accent bar */}
          <div className={`w-1.5 shrink-0 ${
            step.storageLocation === 'fridge' ? 'bg-sky-400' :
            step.storageLocation === 'freezer' ? 'bg-blue-400' :
            step.storageLocation === 'pantry' ? 'bg-amber-400' :
            'bg-stone-400'
          }`} />
          <CardContent className="pt-4 pb-4 flex-1">
            {/* Header row */}
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-[#F4F1EA] rounded-lg p-2 shrink-0">
                <MethodIcon className="w-4 h-4 text-[#555]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-[#222]">{step.method.name}</h4>
                  <Badge variant="outline" className={`text-[10px] border ${STORAGE_COLORS[step.storageLocation]}`}>
                    {STORAGE_LABELS[step.storageLocation]}
                  </Badge>
                </div>
                <p className="text-xs text-[#6b6559] mt-0.5">{step.method.description}</p>
              </div>
            </div>

            {/* Weight allocation */}
            <div className="flex items-center gap-2 mb-3 bg-[#F4F1EA] rounded-lg px-3 py-2">
              <Weight className="w-3.5 h-3.5 text-[#2D5A27] shrink-0" />
              <span className="text-sm font-bold text-[#222]">
                {step.weightLbs} lbs
              </span>
              <span className="text-stone-300">→</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#a8a29e] shrink-0" />
              <span className="text-sm font-semibold text-[#2D5A27]">{step.method.name}</span>
              <span className="ml-auto text-xs text-[#6b6559]">
                ({step.weightGrams} g)
              </span>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <BoxSelect className="w-3.5 h-3.5 text-[#a8a29e] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#a8a29e] uppercase tracking-wide">Space Used</p>
                  <p className="text-xs font-medium text-[#444]">{step.spaceUsed}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#a8a29e] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#a8a29e] uppercase tracking-wide">Processing Time</p>
                  <p className="text-xs font-medium text-[#444]">{step.processingTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#a8a29e] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#a8a29e] uppercase tracking-wide">Shelf Life</p>
                  <p className="text-xs font-medium text-[#444]">{step.shelfLife}</p>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-[#f2f7f0]/50 rounded-lg px-3 py-2.5 border border-[#e8f0e6]/50">
              <p className="text-xs text-[#444] leading-relaxed">{step.instructions}</p>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

function DiversionPlanCard({
  plan,
  item,
  totalLbs,
  onExport,
  onPrint,
}: {
  plan: DiversionPlan;
  item: BulkItem;
  totalLbs: number;
  onExport: () => void;
  onPrint: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6"
    >
      {/* Plan Header */}
      <div className="text-center space-y-2 py-2">
        <div className="inline-flex items-center gap-2 bg-[#e8f0e6] text-[#2D5A27] text-xs font-medium px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          Diversion Plan Generated
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#222]">
          {item.emoji} {item.name} — {totalLbs} lbs
        </h2>
        <p className="text-sm text-[#6b6559]">
          {plan.steps.length} processing methods to fit everything in your apartment
        </p>
      </div>

      {/* Action buttons — hidden on print */}
      <div className="flex flex-col items-center gap-2 print-hide">
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
        <MiniStat icon={Weight} label="Total Weight" value={`${totalLbs} lbs`} />
        <MiniStat icon={Layers} label="Methods" value={`${plan.steps.length} ways`} />
        <MiniStat icon={Clock} label="Active Time" value="~1-2 hrs" />
        <MiniStat icon={BoxSelect} label="Storage Zones" value={`${[...new Set(plan.steps.map(s => s.storageLocation))].length} zones`} />
      </div>

      <Tabs defaultValue="plan" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-[#F4F1EA]">
          <TabsTrigger value="plan" className="text-xs sm:text-sm">
            <ArrowRight className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Diversion Plan
          </TabsTrigger>
          <TabsTrigger value="space" className="text-xs sm:text-sm">
            <BoxSelect className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Space Math
          </TabsTrigger>
          <TabsTrigger value="tips" className="text-xs sm:text-sm">
            <Lightbulb className="w-3.5 h-3.5 mr-1 hidden sm:inline" />
            Tips & Notes
          </TabsTrigger>
        </TabsList>

        {/* Diversion Plan Tab */}
        <TabsContent value="plan">
          <div className="space-y-4 mt-3">
            {/* Space Math Summary bar */}
            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BoxSelect className="w-4 h-4 text-[#2D5A27]" />
                  Space Math Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpaceMathBar plan={plan} />
              </CardContent>
            </Card>

            {/* Steps */}
            {plan.steps.map((step, i) => (
              <DiversionStepCard key={step.method.id} step={step} index={i} />
            ))}
          </div>
        </TabsContent>

        {/* Space Math Tab */}
        <TabsContent value="space">
          <div className="space-y-4 mt-3">
            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BoxSelect className="w-4 h-4 text-[#2D5A27]" />
                  Storage Footprint Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpaceMathBar plan={plan} />
              </CardContent>
            </Card>

            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#6b6559]" />
                  Per-Method Space Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.steps.map((step, i) => {
                    const Icon = STORAGE_ICONS[step.storageLocation];
                    return (
                      <motion.div
                        key={step.method.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                      >
                        <div className={`rounded-lg p-2 shrink-0 ${STORAGE_COLORS[step.storageLocation]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#222]">
                            {step.weightLbs} lbs → {step.method.name}
                          </p>
                          <p className="text-xs text-[#6b6559]">
                            {STORAGE_LABELS[step.storageLocation]} · {step.spaceUsed}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-start gap-2 text-xs text-[#6b6559] bg-amber-50 rounded-lg px-3 py-2">
              <Info className="w-3.5 h-3.5 text-[#2D5A27] shrink-0 mt-0.5" />
              <span>
                The &ldquo;Space Math&rdquo; shows the storage footprint <em>after</em> processing.
                Raw {totalLbs} lbs of {item.name.toLowerCase()} would take up significantly more space.
                That&apos;s the whole point — processing collapses the volume so it all fits.
              </span>
            </div>
          </div>
        </TabsContent>

        {/* Tips & Notes Tab */}
        <TabsContent value="tips">
          <div className="space-y-4 mt-3">
            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[#2D5A27]" />
                  Bulk Buying Tips for {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {item.tips.map((tip, i) => (
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
                      <p className="text-sm text-[#444] leading-relaxed pt-0.5">{tip}</p>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#d6d3c8] shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#6b6559]" />
                  General Bulk-Buy Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Process within 24-48 hours of purchase',
                    'Set up a "processing station" with all tools ready',
                    'Work in batches — 5-10 lbs at a time',
                    'Label everything with item, date, and method',
                    'Freeze flat bags for easy stacking',
                    'Use a food processor for bulk shredding/dicing',
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#444]">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Print-only: Notes section for handwriting */}
      <div className="print-only-notes">
        <div className="print-section-title">Notes</div>
        <div className="print-meta-row">
          <span>Date processed: _______________</span>
          <span>Source: _______________</span>
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

// ---- Main Calculator ----

export default function BulkBuyCalculator({
  initialItemId,
  initialWeightLbs,
}: {
  initialItemId?: string | null;
  initialWeightLbs?: number | null;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string>(initialItemId || '');
  const [weightLbs, setWeightLbs] = useState<string>(initialWeightLbs ? String(initialWeightLbs) : '10');
  const [toast, setToast] = useState<string | null>(null);

  const selectedItem = useMemo(
    () => BULK_ITEMS.find((item) => item.id === selectedItemId) ?? null,
    [selectedItemId]
  );

  const parsedWeight = useMemo(() => {
    const n = parseFloat(weightLbs);
    return isNaN(n) ? 0 : Math.max(0.5, Math.min(100, n));
  }, [weightLbs]);

  const plan: DiversionPlan | null = useMemo(() => {
    if (!selectedItem || parsedWeight < 0.5) return null;
    return generateDiversionPlan(selectedItem, parsedWeight);
  }, [selectedItem, parsedWeight]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleExport = useCallback(() => {
    if (!plan || !selectedItem) return;
    downloadDiversionText(plan, selectedItem.name, selectedItem.emoji, parsedWeight);
    showToast('Downloaded!');
  }, [plan, selectedItem, parsedWeight, showToast]);


  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleReset = useCallback(() => {
    setSelectedItemId('');
    setWeightLbs('10');
  }, []);

  const handleQuickWeight = useCallback((lbs: number) => {
    setWeightLbs(String(lbs));
  }, []);

  const canGenerate = selectedItem !== null && parsedWeight >= 0.5;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f2f7f0]/60 via-white to-[#e8f0e6]/40" data-page="bulk-buy">
      {/* Sub-header */}
      <div className="bg-white/50 border-b border-stone-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-end gap-1.5">
          {(selectedItemId || weightLbs !== '10') && (
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
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-[#2D5A27] text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {toast}
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
            Buy in Bulk.{' '}
            <span className="text-[#2D5A27]">Fit It All In.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6b6559] max-w-lg mx-auto leading-relaxed">
            {selectedItem ? (
              <span className="font-semibold text-[#444]">
                {parsedWeight} lbs of {selectedItem.name}
              </span>
            ) : (
              <span className="italic text-[#a8a29e]">
                20 lbs of carrots, 50 lbs of potatoes…
              </span>
            )}
            {' '}— your apartment can handle it. Get a custom diversion plan that breaks down
            exactly how to process your bulk buy so 100% of it fits in your standard
            fridge, freezer, and one kitchen cabinet.
          </p>
        </motion.div>

        {/* Step 1: Choose Your Bulk Buy */}
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
            <h3 className="font-semibold text-[#222]">Choose Your Bulk Buy</h3>
            <Badge variant="secondary" className="text-[10px] bg-[#F4F1EA]">
              {BULK_ITEMS.length} items
            </Badge>
          </div>
          <Card className="border-[#d6d3c8] shadow-sm">
            <CardContent className="pt-5 space-y-4">
              {/* Item selector */}
              <div className="space-y-2">
                <Label className="text-sm text-[#555]">Produce Item</Label>
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Choose your bulk produce..." />
                  </SelectTrigger>
                  <SelectContent>
                    {BULK_ITEMS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <span className="flex items-center gap-2">
                          <span>{item.emoji}</span>
                          <span>{item.name}</span>
                          <Badge variant="outline" className="text-[9px] ml-1 bg-[#F4F1EA] border-[#d6d3c8] text-[#a8a29e] capitalize">
                            {item.category}
                          </Badge>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight input */}
              <div className="space-y-2">
                <Label className="text-sm text-[#555]">Total Weight (lbs)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0.5}
                    max={100}
                    step={0.5}
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(e.target.value)}
                    placeholder="10"
                    className="w-32 h-10 text-center text-lg font-semibold"
                  />
                  <span className="text-sm text-[#6b6559]">lbs</span>
                </div>
              </div>

              {/* Quick-select buttons */}
              <div className="space-y-2">
                <Label className="text-xs text-[#a8a29e]">Popular bulk sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 20, 50].map((lbs) => (
                    <motion.button
                      key={lbs}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickWeight(lbs)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        parseFloat(weightLbs) === lbs
                          ? 'bg-[#2D5A27] text-white border-emerald-600'
                          : 'bg-white text-[#555] border-[#d6d3c8] hover:border-[#2D5A27]/40 hover:bg-[#f2f7f0]'
                      }`}
                    >
                      {lbs} lbs
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Item grid for quick browsing */}
              <div className="pt-2">
                <p className="text-xs text-[#a8a29e] mb-2">Or tap to select:</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {BULK_ITEMS.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ y: -2, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-colors ${
                        selectedItemId === item.id
                          ? 'bg-[#f2f7f0] border-[#2D5A27]/40 shadow-sm'
                          : 'bg-white border-stone-100 hover:border-[#b5b0a3] hover:shadow-sm'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{item.emoji}</span>
                      <span className="text-[9px] sm:text-[10px] text-[#555] leading-tight text-center truncate w-full">
                        {item.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Step 2: Diversion Plan */}
        <AnimatePresence>
          {canGenerate && plan && selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-[#2D5A27] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <h3 className="font-semibold text-[#222]">Your Diversion Plan</h3>
                <Badge className="bg-[#e8f0e6] text-[#2D5A27] text-[10px] border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generated
                </Badge>
              </div>
              <Card className="border-[#d6d3c8] shadow-md overflow-hidden" data-print-recipe>
                <CardContent className="pt-5">
                  <DiversionPlanCard
                    plan={plan}
                    item={selectedItem}
                    totalLbs={parsedWeight}
                    onExport={handleExport}
                    onPrint={handlePrint}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shelf-Life Tracker - shown after plan is generated */}
            {plan && selectedItem && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className='mb-6 print-hide'
              >
                <ShelfLifeTracker
                  method={plan?.steps?.[0] ? METHOD_NAME_MAP[plan.steps[0].method.name] || plan.steps[0].method.name : undefined}
                  itemName={selectedItem ? `${selectedItem.name} — ${plan?.steps?.[0]?.method.name || 'Stored'}` : undefined}
                />
              </motion.div>
            )}

        {/* Cross-sell upsell — AccessGate on the target page handles paywall */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 mb-4 print-hide"
        >
          <a
            href="/preserving"
            className="block rounded-xl border border-[#d6d3c8] bg-gradient-to-r from-emerald-50 to-[#F4F1EA] p-4 sm:p-5 no-underline hover:shadow-md hover:border-emerald-200 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="bg-[#e8f0e6] rounded-lg p-2.5 shrink-0">
                <Leaf className="w-5 h-5 text-[#2D5A27]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#a8a29e] uppercase tracking-wide mb-0.5">Also from Homesteading Guide</p>
                <p className="text-sm font-semibold text-[#222]">Got a micro-harvest? Get custom preserving recipes.</p>
                <p className="text-xs text-[#6b6559] mt-1">
                  Quick pickle, lacto-ferment, or water-bath can — scaled to fit a single Mason jar.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2D5A27] mt-2">
                  Try the Preserving Calculator
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </a>
        </motion.div>
      </main>
    </div>
  );
}