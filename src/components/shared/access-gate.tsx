'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  Leaf,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type CalculatorId,
  ACCESS_CONFIG,
  checkAccess,
  grantAccess,
  getOtherCalculator,
} from '@/lib/access-config';

// ---- Props ----

interface AccessGateProps {
  calculatorId: CalculatorId;
  searchParams: string;
  children: React.ReactNode;
  /** Optional: show a blurred preview of the calculator behind the gate */
  previewContent?: React.ReactNode;
}

// ---- Component ----

export default function AccessGate({
  calculatorId,
  searchParams,
  children,
  previewContent,
}: AccessGateProps) {
  const [accessState, setAccessState] = useState<
    'checking' | 'granted' | 'denied' | 'just-granted'
  >('checking');
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const config = ACCESS_CONFIG[calculatorId];
  const otherCalc = getOtherCalculator(calculatorId);

  // Check access on mount
  useEffect(() => {
    const { hasAccess, justGranted } = checkAccess(calculatorId, searchParams);
    if (hasAccess) {
      setAccessState(justGranted ? 'just-granted' : 'granted');
    } else {
      setAccessState('denied');
    }
  }, [calculatorId, searchParams]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setIsSubmitting(true);

      // Small delay to show loading state
      setTimeout(() => {
        const success = grantAccess(calculatorId, codeInput);
        if (success) {
          setAccessState('just-granted');
        } else {
          setError('Invalid access code. Please check and try again.');
          setIsSubmitting(false);
        }
      }, 400);
    },
    [calculatorId, codeInput]
  );

  // Show nothing during check (prevents flash of gate)
  if (accessState === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F1EA]">
        <Loader2 className="w-6 h-6 text-[#2D5A27] animate-spin" />
      </div>
    );
  }

  // Full access — render children
  if (accessState === 'granted') {
    return <>{children}</>;
  }

  // Just granted — show success then render children
  if (accessState === 'just-granted') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F4F1EA]">
        <div className="flex-1 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-[#e8f0e6] flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-[#2D5A27]" />
            </motion.div>
            <h2 className="text-xl font-bold text-[#222] mb-2">You're In!</h2>
            <p className="text-sm text-[#6b6559] mb-6">
              Welcome to the {config.label}. Your access has been saved — no need to
              enter the code again.
            </p>
            <Button
              onClick={() => setAccessState('granted')}
              className="bg-[#2D5A27] hover:bg-[#1e3d1a] text-white"
            >
              Open {config.label}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Access denied — show gate with upsell
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1EA]" data-page={calculatorId}>
      {/* Blurred preview behind gate */}
      {previewContent && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none select-none -z-10">
          <div className="absolute inset-0 scale-[0.92] blur-xl opacity-40">
            {previewContent}
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-6"
        >
          {/* Gate card */}
          <Card className="border-[#d6d3c8] shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-[#2D5A27] px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">{config.label}</h1>
              <p className="text-sm text-white/80 mt-1">{config.description}</p>
            </div>

            <CardContent className="pt-6 pb-6 px-6 space-y-5">
              {/* Access code form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <Label htmlFor="access-code" className="text-sm text-[#222]">
                  Enter your access code
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="access-code"
                    type="text"
                    value={codeInput}
                    onChange={(e) => {
                      setCodeInput(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="e.g. PRESERVE-ABC123"
                    className="flex-1 h-11 bg-white border-[#d6d3c8] focus:border-[#2D5A27]"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    disabled={!codeInput.trim() || isSubmitting}
                    className="bg-[#2D5A27] hover:bg-[#1e3d1a] text-white h-11 px-5 shrink-0"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Unlock className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-red-600"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {error}
                  </motion.p>
                )}
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#d6d3c8]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-[#6b6559]">or</span>
                </div>
              </div>

              {/* Purchase CTA */}
              <a
                href={config.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block no-underline"
              >
                <Button
                  variant="outline"
                  className="w-full h-12 border-[#2D5A27] text-[#2D5A27] hover:bg-[#e8f0e6] text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Purchase Access to {config.label}
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Upsell card for the OTHER calculator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-[#d6d3c8] bg-gradient-to-r from-[#f2f7f0] to-white hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-5 px-5">
                <div className="flex items-start gap-3">
                  <div className="bg-[#e8f0e6] rounded-lg p-2.5 shrink-0">
                    {otherCalc.id === 'preserving' ? (
                      <Leaf className="w-5 h-5 text-[#2D5A27]" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-[#2D5A27]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#6b6559] uppercase tracking-wide mb-0.5">
                      Also available
                    </p>
                    <p className="text-sm font-semibold text-[#222]">
                      {otherCalc.label}
                    </p>
                    <p className="text-xs text-[#6b6559] mt-1 leading-relaxed">
                      {otherCalc.description}
                    </p>
                    <a
                      href={otherCalc.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#2D5A27] mt-2 no-underline hover:underline"
                    >
                      Get {otherCalc.label}
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
