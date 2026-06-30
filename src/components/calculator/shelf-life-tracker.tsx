'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  Printer,
  Tag,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// ---- Types ----

export type TrackerMethod =
  | 'Quick Pickle'
  | 'Lacto-Ferment'
  | 'Water-Bath Can'
  | 'Flash-Freeze'
  | 'Dehydrate'
  | 'Roast & Freeze'
  | 'Blanch & Freeze'
  | 'Make Sauce'
  | 'Caramelize & Freeze'
  | 'Make Jam'
  | 'Make Butter'
  | 'Make Powder'
  | 'Make Chips'
  | 'Make Pesto'
  | 'Make Broth'
  | 'Store Cool & Dark'
  | 'Confit';

interface ShelfLifeInfo {
  storageLocation: string;
  shelfLifeMonths: number;
  shelfLifeLabel: string;
  isShelfStable: boolean;
}

// ---- Data ----

const METHOD_SHELF_DATA: Record<TrackerMethod, ShelfLifeInfo> = {
  'Quick Pickle': {
    storageLocation: 'Fridge',
    shelfLifeMonths: 1,
    shelfLifeLabel: '1 Month (Refrigerated)',
    isShelfStable: false,
  },
  'Lacto-Ferment': {
    storageLocation: 'Fridge',
    shelfLifeMonths: 6,
    shelfLifeLabel: '6 Months (Refrigerated)',
    isShelfStable: false,
  },
  'Water-Bath Can': {
    storageLocation: 'Cool, Dark Pantry',
    shelfLifeMonths: 12,
    shelfLifeLabel: '12 Months (Shelf-Stable)',
    isShelfStable: true,
  },
  'Flash-Freeze': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 12,
    shelfLifeLabel: '12 Months (Frozen)',
    isShelfStable: false,
  },
  'Dehydrate': {
    storageLocation: 'Dark Cupboard',
    shelfLifeMonths: 12,
    shelfLifeLabel: '12+ Months (Pantry)',
    isShelfStable: true,
  },
  'Roast & Freeze': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 6,
    shelfLifeLabel: '6 Months (Frozen)',
    isShelfStable: false,
  },
  'Blanch & Freeze': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 10,
    shelfLifeLabel: '10-12 Months (Frozen)',
    isShelfStable: false,
  },
  'Make Sauce': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 6,
    shelfLifeLabel: '6 Months (Frozen)',
    isShelfStable: false,
  },
  'Caramelize & Freeze': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 6,
    shelfLifeLabel: '6 Months (Frozen)',
    isShelfStable: false,
  },
  'Make Jam': {
    storageLocation: 'Cool, Dark Pantry',
    shelfLifeMonths: 12,
    shelfLifeLabel: '12 Months (Shelf-Stable)',
    isShelfStable: true,
  },
  'Make Butter': {
    storageLocation: 'Fridge',
    shelfLifeMonths: 3,
    shelfLifeLabel: '3 Months (Refrigerated)',
    isShelfStable: false,
  },
  'Make Powder': {
    storageLocation: 'Dark Cupboard',
    shelfLifeMonths: 12,
    shelfLifeLabel: '12+ Months (Pantry)',
    isShelfStable: true,
  },
  'Make Chips': {
    storageLocation: 'Pantry',
    shelfLifeMonths: 1,
    shelfLifeLabel: '1-2 Weeks (Pantry)',
    isShelfStable: false,
  },
  'Make Pesto': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 6,
    shelfLifeLabel: '6 Months (Frozen)',
    isShelfStable: false,
  },
  'Make Broth': {
    storageLocation: 'Freezer',
    shelfLifeMonths: 6,
    shelfLifeLabel: '6 Months (Frozen)',
    isShelfStable: false,
  },
  'Store Cool & Dark': {
    storageLocation: 'Cool, Dark Cupboard',
    shelfLifeMonths: 3,
    shelfLifeLabel: '1-3 Months (Stored)',
    isShelfStable: false,
  },
  'Confit': {
    storageLocation: 'Fridge',
    shelfLifeMonths: 3,
    shelfLifeLabel: '3 Months (Refrigerated)',
    isShelfStable: false,
  },
};

// ---- Helpers ----

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function toLocalDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// ---- Component Props ----

interface ShelfLifeTrackerProps {
  method?: string;
  itemName?: string;
  compact?: boolean;
}

// ---- Component ----

export default function ShelfLifeTracker({
  method: initialMethod,
  itemName: initialItemName,
  compact = false,
}: ShelfLifeTrackerProps) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [selectedMethod, setSelectedMethod] = useState<TrackerMethod | ''>(
    (initialMethod as TrackerMethod) || ''
  );
  const [dateProcessed, setDateProcessed] = useState(todayStr);
  const [itemName, setItemName] = useState(initialItemName || '');
  const [showPrintLabel, setShowPrintLabel] = useState(false);

  const shelfInfo = useMemo(
    () => (selectedMethod ? METHOD_SHELF_DATA[selectedMethod] : null),
    [selectedMethod]
  );

  const bestByDate = useMemo(() => {
    if (!shelfInfo || !dateProcessed) return null;
    const [y, m, d] = dateProcessed.split('-').map(Number);
    const processed = new Date(y, m - 1, d);
    return addMonths(processed, shelfInfo.shelfLifeMonths);
  }, [shelfInfo, dateProcessed]);

  const daysRemaining = useMemo(() => {
    if (!bestByDate) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = bestByDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [bestByDate]);

  const handlePrintLabel = useCallback(() => {
    setShowPrintLabel(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setShowPrintLabel(false), 500);
    }, 100);
  }, []);

  const allMethods = Object.keys(METHOD_SHELF_DATA) as TrackerMethod[];

  const printLabel = shelfInfo && bestByDate && (
    <div className="label-print-only" aria-hidden="true">
      <div
        style={{
          border: '2px dashed #2D5A27',
          borderRadius: '12px',
          padding: '24px 32px',
          maxWidth: '400px',
          margin: '0 auto',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#6b6559',
            borderBottom: '1px solid #d6d3c8',
            paddingBottom: '6px',
            marginBottom: '12px',
          }}
        >
          YOUR STORAGE REMINDER
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#222', marginBottom: '16px' }}>
          {itemName || 'Untitled Preserves'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#444' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b6559' }}>Method:</span>
            <span style={{ fontWeight: 600 }}>{selectedMethod}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b6559' }}>Date Packaged:</span>
            <span style={{ fontWeight: 600 }}>{formatDateShort(new Date(dateProcessed + 'T00:00:00'))}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6b6559' }}>Best By:</span>
            <span style={{ fontWeight: 700, color: '#2D5A27' }}>{formatDate(bestByDate)}</span>
          </div>
        </div>
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px dashed #d6d3c8',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#6b6559',
          }}
        >
          <span>Storage: {shelfInfo.storageLocation}</span>
          <span>{shelfInfo.shelfLifeLabel}</span>
        </div>
        <div
          style={{
            marginTop: '12px',
            fontSize: '9px',
            color: '#a8a29e',
            textAlign: 'center',
          }}
        >
          Apartment Homesteading Calculators | homesteadingguide.com
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showPrintLabel && printLabel}

      <Card
        className={`border-[#d6d3c8] shadow-sm overflow-hidden ${compact ? '' : 'bg-white'}`}
      >
        {!compact && (
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#e8f0e6] flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-[#2D5A27]" />
              </div>
              Your Custom Storage Guide
            </CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? 'p-4' : 'pt-0 pb-5 px-5'}>
          <div className="space-y-4">
            {/* Method selector */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6b6559]">Preserving Method</Label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as TrackerMethod)}
                className="w-full h-9 rounded-lg border border-[#d6d3c8] bg-white px-3 text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]"
              >
                <option value="">Select method...</option>
                {allMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Item name */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6b6559]">
                Label Name <span className="opacity-50">(optional)</span>
              </Label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Jalapeno Quick Pickles"
                className="w-full h-9 rounded-lg border border-[#d6d3c8] bg-white px-3 text-sm text-[#222] placeholder:text-[#a8a29e] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]"
              />
            </div>

            {/* Date processed */}
            <div className="space-y-1.5">
              <Label className="text-xs text-[#6b6559]">Date Processed</Label>
              <input
                type="date"
                value={dateProcessed}
                onChange={(e) => setDateProcessed(toLocalDateStr(e.target.value))}
                className="w-full h-9 rounded-lg border border-[#d6d3c8] bg-white px-3 text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]"
              />
            </div>

            {/* Storage info */}
            {shelfInfo && bestByDate && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div
                  className="rounded-2xl border-2 border-dashed border-[#2D5A27]/30 bg-[#f2f7f0]/50 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#6b6559] uppercase tracking-wide">
                        Storage Location
                      </p>
                      <p className="text-sm font-semibold text-[#222]">
                        {shelfInfo.storageLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2D5A27] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#6b6559] uppercase tracking-wide">
                        Optimal Shelf Life
                      </p>
                      <p className="text-sm font-semibold text-[#222]">
                        {shelfInfo.shelfLifeLabel}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-[#d6d3c8]/60">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#6b6559] uppercase tracking-wide">
                          Best By Date
                        </p>
                        <p className="text-lg font-bold text-[#2D5A27]">
                          {formatDate(bestByDate)}
                        </p>
                      </div>
                      {daysRemaining !== null && (
                        <Badge
                          className={`${
                            daysRemaining <= 30
                              ? 'bg-amber-100 text-amber-700 border-amber-200'
                              : daysRemaining <= 90
                                ? 'bg-[#e8f0e6] text-[#2D5A27] border-[#2D5A27]/20'
                                : 'bg-[#e8f0e6] text-[#2D5A27] border-[#2D5A27]/20'
                          }`}
                          variant="outline"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {daysRemaining === 0
                            ? 'Use today!'
                            : `${daysRemaining} days left`}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePrintLabel}
                  variant="outline"
                  className="w-full border-[#2D5A27] text-[#2D5A27] hover:bg-[#e8f0e6] text-xs h-9 print-hide"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Reminder Label
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
