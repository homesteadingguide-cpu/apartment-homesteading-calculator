// ============================================================
// Apartment Homesteading Calculators — Access Code Configuration
// ============================================================
//
// Set one or more valid access codes per calculator.
// Buyers receive a code after purchase on homesteadingguide.com.
// Codes are checked via ?access=CODE query param or localStorage.
//
// HOW IT WORKS:
//   1. User visits /preserving?access=CODE123
//   2. If code is valid → full access, code saved to localStorage
//   3. Subsequent visits don't need the query param
//   4. Without a valid code → teaser preview + purchase CTA
//
// To add more codes, just add to the arrays below.
// To generate new codes for buyers, use any alphanumeric string.
// ============================================================

export type CalculatorId = 'preserving' | 'bulk-buy';

export interface AccessConfig {
  preserving: {
    label: 'Preserving Calculator';
    description: 'Turn your micro-harvest into custom, safe, small-batch preserving recipes.';
    codes: string[];
    purchaseUrl: string;
  };
  'bulk-buy': {
    label: 'Bulk-Buy Diversion Matrix';
    description: 'Buy in bulk, process in 2 hours, fit 100% of it in your apartment.';
    codes: string[];
    purchaseUrl: string;
  };
}

/**
 * ACCESS CONFIGURATION
 * 
 * Add your access codes below. These are the codes you'll
 * distribute to buyers after purchase.
 * 
 * TODO: Replace placeholder codes and purchase URLs with real ones.
 */
export const ACCESS_CONFIG: AccessConfig = {
  preserving: {
    label: 'Preserving Calculator',
    description: 'Turn your micro-harvest into custom, safe, small-batch preserving recipes.',
    codes: [
      'GREENFINGERS', // Demo code — replace with real buyer codes
    ],
    purchaseUrl: 'https://homesteadingguide.com/preserving-calculator',
  },
  'bulk-buy': {
    label: 'Bulk-Buy Diversion Matrix',
    description: 'Buy in bulk, process in 2 hours, fit 100% of it in your apartment.',
    codes: [
      'GREENTHUMB', // Demo code — replace with real buyer codes
    ],
    purchaseUrl: 'https://homesteadingguide.com/bulk-buy-calculator',
  },
};

// --- Storage keys ---
const STORAGE_PREFIX = 'apt-homesteading-access';

function getStorageKey(calculatorId: CalculatorId): string {
  return `${STORAGE_PREFIX}-${calculatorId}`;
}

// --- Public API ---

/**
 * Check if a code is valid for a given calculator.
 */
export function isValidCode(calculatorId: CalculatorId, code: string): boolean {
  const config = ACCESS_CONFIG[calculatorId];
  if (!config) return false;
  return config.codes.includes(code.toUpperCase().trim());
}

/**
 * Check if user has previously been granted access (stored in localStorage).
 */
export function hasStoredAccess(calculatorId: CalculatorId): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(getStorageKey(calculatorId));
    if (!stored) return false;
    // Verify the stored code is still valid (in case codes get revoked)
    return isValidCode(calculatorId, stored);
  } catch {
    return false;
  }
}

/**
 * Grant access and persist it to localStorage.
 */
export function grantAccess(calculatorId: CalculatorId, code: string): boolean {
  if (!isValidCode(calculatorId, code)) return false;
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(getStorageKey(calculatorId), code.toUpperCase().trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Check full access: either stored access OR valid code from URL.
 * If code is in URL and valid, auto-grant and clean the URL.
 * Returns { hasAccess, justGranted }.
 */
export function checkAccess(
  calculatorId: CalculatorId,
  searchParams: string
): { hasAccess: boolean; justGranted: boolean } {
  // 1. Check stored access first
  if (hasStoredAccess(calculatorId)) {
    return { hasAccess: true, justGranted: false };
  }

  // 2. Check URL for access code
  try {
    const params = new URLSearchParams(searchParams);
    const code = params.get('access');
    if (code && isValidCode(calculatorId, code)) {
      grantAccess(calculatorId, code);
      // Clean the URL (remove access param without reloading)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('access');
        window.history.replaceState({}, '', url.toString());
      }
      return { hasAccess: true, justGranted: true };
    }
  } catch {
    // URL parsing failed
  }

  return { hasAccess: false, justGranted: false };
}

/**
 * Get the other calculator's info for upsell.
 */
export function getOtherCalculator(currentId: CalculatorId) {
  const otherId: CalculatorId = currentId === 'preserving' ? 'bulk-buy' : 'preserving';
  const config = ACCESS_CONFIG[otherId];
  return {
    id: otherId,
    label: config.label,
    description: config.description,
    href: `/${otherId}`,
    purchaseUrl: config.purchaseUrl,
  };
}
