'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Clock,
  Download,
  Printer,
  Link2,
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
  pantry: 'bg-amber-100 text-amber-700 border-amber-200',
  counter: 'bg-stone-100 text-stone-700 border-stone-200',
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
    <div className="bg-white rounded-xl border border-stone-200 p-3 text-center">
      <Icon className="w-4 h-4 mx-auto text-stone-400 mb-1" />
      <p className="text-xs text-stone-500">{label}</p>
      <p className="text-sm font-semibold text-stone-800 mt-0.5">{value}</p>
    </div>
  );
}

function SpaceMathBar({ plan }: { plan: DiversionPlan }) {
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
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-stone-700 bg-emerald-50 rounded-lg px-3 py-2">
        <BoxSelect className="w-4 h-4 text-emerald-600" />
        Total after processing: {totalCubicFt.toFixed(2)} cubic feet
      </div>

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
      <Card className="border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-stretch">
          <div className={`w-1.5 shrink-0 ${
            step.storageLocation === 'fridge' ? 'bg-sky-400' :
            step.storageLocation === 'freezer' ? 'bg-blue-400' :
            step.storageLocation === 'pantry' ? 'bg-amber-400' :
            'bg-stone-400'
          }`} />
          <CardContent className="pt-4 pb-4 flex-1">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-stone-100 rounded-lg p-2 shrink-0">
                <MethodIcon className="w-4 h-4 text-stone-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-stone-900">{step.method.name}</h4>
                  <Badge variant="outline" className={`text-[10px] border ${STORAGE_COLORS[step.storageLocation]}`}>
                    {STORAGE_LABELS[step.storageLocation]}
                  </Badge>
                </div>
                <p className="text-xs text-stone-500 mt-1">{step.weightLbs} lbs processed yield</p>
              </div>
            </div>
            <div className="bg-stone-50 rounded-lg p-3 space-y-1.5">
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                <span className="font-semibold text-emerald-700">Action:</span> {step.instructions}
              </p>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

// ---- Main Component Implementation ----

export default function BulkBuyCalculator() {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [weight, setWeight] = useState<number>(25);

  const activeItem = useMemo(() => {
    return BULK_ITEMS.find((item) => item.id === selectedItem) || null;
  }, [selectedItem]);

  const diversionPlan = useMemo(() => {
    if (!activeItem || weight <= 0) return null;
    return generateDiversionPlan(activeItem.id, weight);
  }, [activeItem, weight]);

  const handleExportText = useCallback(() => {
    if (!diversionPlan) return;
    downloadDiversionText(diversionPlan);
  }, [diversionPlan]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-[#F4F1EA] min-h-screen text-stone-800">
      <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900">Bulk-Buy Diversion Matrix</h1>
          <p className="text-sm text-stone-500 mt-1">Split oversized produce hauls into smart apartment footprint targets.</p>
        </div>
        <Link href="/preserving">
          <Button variant="outline" size="sm" className="bg-white">
            <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Preserving Calculator
          </Button>
        </Link>
      </div>

