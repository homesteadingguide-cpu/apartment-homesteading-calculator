import type { Metadata } from 'next';
import PreservingCalculator from '@/components/calculator/preserving-calculator';

export const metadata: Metadata = {
  title: 'Preserving Calculator | Balcony-to-Pantry',
  description:
    'Turn your apartment micro-harvest into custom, safe, small-batch preserving recipes scaled to fit a single Mason jar. Quick pickle, lacto-ferment, or water-bath can — no 10-pound recipes required.',
};

// Decode share link payload server-side
function decodePayload(encoded: string | undefined): {
  method: string | null;
  entries: { produceId: string; weightGrams: number }[] | null;
} {
  if (!encoded) return { method: null, entries: null };
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    if (!payload.m || !Array.isArray(payload.e) || payload.e.length === 0) {
      return { method: null, entries: null };
    }
    if (!['quick-pickle', 'ferment', 'water-bath'].includes(payload.m)) {
      return { method: null, entries: null };
    }
    return {
      method: payload.m,
      entries: payload.e.map((item: { id: string; w: number }) => ({
        produceId: item.id,
        weightGrams: Math.max(10, Math.min(2000, item.w || 150)),
      })),
    };
  } catch {
    return { method: null, entries: null };
  }
}

export default async function PreservingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const encoded = typeof params.r === 'string' ? params.r : undefined;
  const { method, entries } = decodePayload(encoded);

  return (
    <PreservingCalculator
      initialMethod={method as 'quick-pickle' | 'ferment' | 'water-bath' | null}
      initialEntries={entries}
    />
  );
}