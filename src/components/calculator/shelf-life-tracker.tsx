'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  Printer,
  Tag,
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
  const [labelCount, setLabelCount] = useState(10);

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
    document.body.classList.add('label-print-mode');
    setTimeout(() => {
      window.print();
      setTimeout(() => document.body.classList.remove('label-print-mode'), 500);
    }, 150);
  }, []);

  const allMethods = Object.keys(METHOD_SHELF_DATA) as TrackerMethod[];

  const labelContent = shelfInfo && bestByDate && (
    <>
      <div style={{
        fontSize: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: '#6b6559',
        borderBottom: '1.5px solid #2D5A27',
        paddingBottom: '5px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>HOMESTEADING GUIDE</span>
        <span style={{ fontSize: '7px', letterSpacing: '0.1em' }}>STORAGE LABEL</span>
      </div>

      <div style={{ fontSize: '15px', fontWeight: 700, color: '#222', marginBottom: '10px', lineHeight: 1.2 }}>
        {itemName || 'Untitled Preserves'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: '11px', color: '#444', marginBottom: '10px' }}>
        <div>
          <span style={{ color: '#999', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Method</span>
          <div style={{ fontWeight: 600 }}>{selectedMethod}</div>
        </div>
        <div>
          <span style={{ color: '#999', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Storage</span>
          <div style={{ fontWeight: 600 }}>{shelfInfo.storageLocation}</div>
        </div>
        <div>
          <span style={{ color: '#999', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Date Made</span>
          <div style={{ fontWeight: 600 }}>{formatDateShort(new Date(dateProcessed + 'T00:00:00'))}</div>
        </div>
        <div>
          <span style={{ color: '#999', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Shelf Life</span>
          <div style={{ fontWeight: 600 }}>{shelfInfo.shelfLifeLabel}</div>
        </div>
      </div>

      <div style={{
        background: '#f2f7f0',
        border: '1.5px solid #2D5A27',
        borderRadius: '6px',
        padding: '8px 12px',
        textAlign: 'center',
        marginBottom: '10px',
      }}>
        <div style={{ fontSize: '7px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6b6559', marginBottom: '2px' }}>
          Best By / Expiry Date
        </div>
        <div style={{ fontSize: '16px', fontWeight: 800, color: '#2D5A27', letterSpacing: '0.02em' }}>
          {formatDate(bestByDate)}
        </div>
      </div>

      <div style={{ fontSize: '7px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Notes</div>
      <div style={{ borderBottom: '1px solid #d6d3c8', height: '14px', marginBottom: '4px' }}></div>
      <div style={{ borderBottom: '1px solid #d6d3c8', height: '14px', marginBottom: '4px' }}></div>
    </>
  );

  const printPage = labelContent && (
    <div className="label-print-only" aria-hidden="true" style={{ padding: '12px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '14px 18px',
      }}>
        {Array.from({ length: labelCount }).map((_, i) => (
          <div
            key={i}
            style={{
              border: '2px dashed #2D5A27',
              borderRadius: '10px',
              padding: '16px 20px',
              fontFamily: "'Georgia', 'Times New Roman', serif",
              pageBreakInside: 'avoid',
              breakInside: 'avoid',
            }}
          >
            {labelContent}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {printPage}

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

            <div className="space-y-1.5">
              <Label className="text-xs text-[#6b6559]">Date Processed</Label>
              <input
                type="date"
                value={dateProcessed}
                onChange={(e) => setDateProcessed(toLocalDateStr(e.target.value))}
                className="w-full h-9 rounded-lg border border-[#d6d3c8] bg-white px-3 text-sm text-[#222] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/30 focus:border-[#2D5A27]"
              />
            </div>

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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-[#6b6559]">Labels per page</Label>
                    <div className="flex items-center gap-1">
                      {[6, 10, 14, 20].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setLabelCount(n)}
                          className={`w-8 h-7 rounded text-xs font-medium transition-colors ${
                            labelCount === n
                              ? 'bg-[#2D5A27] text-white'
                              : 'bg-[#F4F1EA] text-[#6b6559] hover:bg-[#e8e4da]'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={handlePrintLabel}
                    variant="outline"
                    className="w-full border-[#2D5A27] text-[#2D5A27] hover:bg-[#e8f0e6] text-xs h-9 print-hide"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    Print {labelCount} Storage Labels
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
