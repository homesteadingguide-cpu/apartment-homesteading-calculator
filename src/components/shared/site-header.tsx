'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, ShoppingCart } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/preserving', label: 'Preserving Calculator', shortLabel: 'Preserving', icon: Leaf },
  { href: '/bulk-buy', label: 'Bulk-Buy Diversion Matrix', shortLabel: 'Bulk Buy', icon: ShoppingCart },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <Link href="/preserving" className="flex items-center gap-2.5 no-underline">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <Leaf className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
              Balcony-to-Pantry
            </h1>
            <p className="text-[10px] sm:text-xs text-stone-400">Apartment Homesteading Tools</p>
          </div>
        </Link>

        {/* Nav pills */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors no-underline ${
                  isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}