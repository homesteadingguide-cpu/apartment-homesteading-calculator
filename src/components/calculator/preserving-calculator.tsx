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
  Link2,
  Printer,
  ShoppingCart,
  ArrowRight,
  Calendar,
  MapPin,
  Hourglass,
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
  copyShareLink,
  type SavedRecipe,
} from '@/hooks/use-recipe-store';

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
  const diffColor = { Easy: 'bg-emerald-100 text-emerald-800', Medium: 'bg-amber-100 text-amber-800', Advanced: 'bg-rose-100 text-rose-800' }[method.difficulty];

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-emerald-500 bg-emerald-50/80 shadow-md shadow-emerald-100'
          : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
      }`}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1"
        >
          <CheckCircle2 className="w-4 h-4" />
        </motion.div>
      )}
      <div className="flex items-start gap-3">
        <div
          className={`rounded-xl p-2.5 ${
            selected ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-500'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">{method.name}</h3>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${diffColor}`}>
              {method.difficulty}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">{method.tagline}</p>
          <p className="text-xs text-stone-400 mt-2 flex items-center gap-1.5">
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
          className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
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
            className="text-center py-8 text-stone-400"
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
                  className="flex items-center gap-3 bg-white rounded-xl border border-stone-200 p-3"
                >
                  <span className="text-2xl">{produce.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{produce.name}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Label className="text-xs text-stone-500 hidden sm:inline">g</Label>
                    <Input
                      type="number"
                      min={10}
                      max={2000}
                      value={entry.weightGrams || ''}
                      onChange={(e) => onUpdateWeight(i, Math.max(10, parseInt(e.target.value) || 0))}
                      placeholder="150"
                      className="w-20 h-9 text-center text-sm"
                    />
                    <Label className="text-xs text-stone-500 sm:hidden">g</Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(i)}
                    className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 shrink-0"
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
        <div className="flex items-center gap-2 text-xs text-stone-500 bg-amber-50 rounded-lg px-3 py-2">
          <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            For the best results, use a kitchen scale. The preserving ratios are calculated to the gram
            — accuracy matters for food safety, especially with fermentation.
          </span>
        </div>
      )}
    </div>
  );
}

/* New Shelf Life Tracker Component */
function ShelfLifeTracker({ methodId }: { methodId: PreservingMethod }) {
  const [processedDate, setProcessedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const storageDetails = useMemo(() => {
    switch (methodId) {
      case 'quick-pickle':
        return {
          location: 'Refrigerator (4°C)',
          timeline: '1 Month',
          monthsToAdd: 1,
          bg: 'bg-blue-50 border-blue-200 text-blue-800',
        };
      case 'ferment':
        return {
          location: 'Cold Storage / Fridge',
          timeline: '4 - 6 Months',
          monthsToAdd: 6,
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
        };
      case 'water-bath':
        return {
          location: 'Cool, Dark Pantry',
          timeline: '1 Year (Shelf-Stable)',
          monthsToAdd: 12,
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        };
      default:
        return {
          location: 'Pantry',
          timeline: 'Indefinite',
          monthsToAdd: 0,
          bg: 'bg-stone-50 border-stone-200 text-stone-800',
        };
    }
  }, [methodId]);

  const bestByDate = useMemo(() => {
    if (!processedDate) return '—';
    const date = new Date(processedDate);
    date.setMonth(date.getMonth() + storageDetails.monthsToAdd);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [processedDate, storageDetails]);

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <Card className="border border-stone-200 bg-stone-50/50 shadow-sm mt-6 overflow-hidden">
      <CardHeader className="bg-white border-b border-stone-100 py-4">
        <CardTitle className="text-base font-semibold text-stone-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600" />
          Your Custom Storage Guide
