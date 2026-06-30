import type { Metadata } from "next";
import AccessGate from '@/components/shared/access-gate';
import PreservingCalculator from '@/components/calculator/preserving-calculator';

export const metadata: Metadata = {
  title: 'Preserving Calculator | Apartment Homesteading Calculators',
  description:
    'Turn your micro-harvest into custom, safe, small-batch preserving recipes. Supports quick pickling, lacto-fermentation, and water-bath canning.',
};

type PreservingShareData = {
  m: string | null;
  e: { id: string; w: number }[] | null;
};

function decodePayload(encoded: string | undefined): PreservingShareData {
  if (!encoded) return { m: null, e: null };
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    if (!payload.m || !Array.isArray(payload.e) || payload.e.length === 0) {
      return { m: null, e: null };
    }
    if (!['quick-pickle', 'ferment', 'water-bath'].includes(payload.m)) {
      return { m: null, e: null };
    }
    return {
      m: payload.m,
      e: payload.e.map((item: { id: string; w: number }) => ({
        id: String(item.id),
        w: Math.max(10, Math.min(2000, item.w || 150)),
      })),
    };
  } catch {
    return { m: null, e: null };
  }
}

export default async function PreservingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const encoded = typeof params.r === 'string' ? params.r : undefined;
  const { m, e } = decodePayload(encoded);

  const spString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).flatMap(([k, v]) =>
        Array.isArray(v) ? v.map((val) => [k, val]) : [[k, v]]
      )
    )
  ).toString();

  return (
    <AccessGate calculatorId="preserving" searchParams={spString}>
      <PreservingCalculator
        initialMethod={m as 'quick-pickle' | 'ferment' | 'water-bath' | null}
        initialEntries={
          e
            ? e.map((entry) => ({
                produceId: entry.id,
                weightGrams: entry.w,
              }))
            : undefined
        }
      />
    </AccessGate>
  );
}
