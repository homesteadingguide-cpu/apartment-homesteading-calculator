import type { Metadata } from 'next';
import BulkBuyCalculator from '@/components/calculator/bulk-buy-calculator';

export const metadata: Metadata = {
  title: 'Bulk-Buy Diversion Matrix | Balcony-to-Pantry',
  description:
    'Buy 20lbs of produce at a time, process it in 2 hours, and fit 100% of it in your standard fridge, freezer, and one kitchen cabinet.',
};

// Decode share link payload server-side
type BulkBuyShareData = {
  item: string | null;
  lbs: number | null;
};

function decodeBulkBuyPayload(encoded: string | undefined): BulkBuyShareData {
  if (!encoded) return { item: null, lbs: null };
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    if (!payload.item || typeof payload.lbs !== 'number') {
      return { item: null, lbs: null };
    }
    return {
      item: String(payload.item),
      lbs: Math.max(0.5, Math.min(100, payload.lbs || 10)),
    };
  } catch {
    return { item: null, lbs: null };
  }
}

export default async function BulkBuyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const encoded = typeof params.d === 'string' ? params.d : undefined;
  const { item, lbs } = decodeBulkBuyPayload(encoded);

  return (
    <BulkBuyCalculator
      initialItemId={item}
      initialWeightLbs={lbs}
    />
  );
}
