import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Heart,
  Gift,
  CheckCircle2,
  Clock,
  Sparkles,
  KeyRound,
  Edit3,
} from 'lucide-react';
import { MemoryItem, CouponItem } from '../types';
import { storageService } from '../services/storage';

interface SecretVaultModalProps {
  memory: MemoryItem | null;
  onClose: () => void;
  onRedeemCoupon?: (couponId: string) => void;
  isAdmin?: boolean;
  onEditLetter?: () => void;
  customLetterTitle?: string;
  customLetterSubtitle?: string;
  customLetterDate?: string;
  customLetterContent?: string;
  customLetterSignoff?: string;
  customPasscode?: string;
}

export const SecretVaultModal: React.FC<SecretVaultModalProps> = ({
  memory,
  onClose,
  onRedeemCoupon,
  isAdmin = false,
  onEditLetter,
  customLetterTitle,
  customLetterSubtitle,
  customLetterDate,
  customLetterContent,
  customLetterSignoff,
  customPasscode,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [coupons, setCoupons] = useState<CouponItem[]>(memory?.coupons || []);

  if (!memory) return null;

  const effectivePasscode = customPasscode || memory.secretPasscode || '1402';
  const effectiveTitle = customLetterTitle || memory.subtitle || 'A Private Letter to You';
  const effectiveSubtitle = customLetterSubtitle || 'Vault Unlocked · For Your Eyes Only';
  const effectiveDate = customLetterDate || memory.date;
  const effectiveContent = customLetterContent || memory.letterContent || memory.fullStory;
  const effectiveSignoff = customLetterSignoff;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === effectivePasscode || passcode.trim() === 'love') {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg(`Incorrect passcode. Try ${effectivePasscode} or tap the secret hint below!`);
    }
  };


  const handleQuickBypass = () => {
    setIsUnlocked(true);
    setErrorMsg('');
  };

  const handleRedeem = async (couponId: string) => {
    const success = await storageService.redeemCoupon(memory.id, couponId);
    if (success) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, redeemed: true } : c))
      );
      if (onRedeemCoupon) onRedeemCoupon(couponId);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#161616] rounded-xl overflow-hidden shadow-2xl border border-white/10 my-auto text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          /* LOCKED STATE */
          <div className="text-center py-10 space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 flex items-center justify-center mx-auto text-[#ff4d5a] shadow-lg shadow-[#E50914]/20 animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#ff4d5a] font-bold">
                Classified Vault Episode
              </span>
              <h2 className="font-bebas text-3xl sm:text-4xl text-white font-black tracking-wide mt-1">
                {memory.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-2">
                This hidden episode contains private letters, vows, and redeemable surprise coupons.
              </p>
            </div>

            {/* Passcode Form */}
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Enter Passcode (e.g. 1402)"
                  className="w-full text-center text-lg tracking-widest font-mono bg-black/60 border border-white/20 focus:border-[#E50914] rounded-lg py-3 px-4 text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>

              {errorMsg && <p className="text-xs text-[#ff4d5a]">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm rounded-lg shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Secret Vault</span>
              </button>

              {/* Romantic Bypass */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickBypass}
                  className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 flex items-center justify-center gap-1.5 mx-auto transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ff4d5a]" />
                  <span>Tap here to unlock with love (Hint: 1402)</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE: LETTER & COUPONS */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-400" />
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  {effectiveSubtitle}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">{effectiveDate}</span>
                {isAdmin && onEditLetter && (
                  <button
                    onClick={onEditLetter}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded border border-amber-500/40 transition-colors cursor-pointer"
                    title="Edit letter, vows, and secret passcode"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Letter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Handwritten Style Love Letter */}
            <div className="bg-[#1f1917] p-6 sm:p-8 rounded-xl border border-amber-900/40 shadow-inner relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-15">
                <Heart className="w-32 h-32 text-amber-500 fill-amber-500" />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="font-bebas text-2xl tracking-wide text-amber-200">
                  {effectiveTitle}
                </h3>
                <div className="text-neutral-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                  {effectiveContent}
                </div>
                {effectiveSignoff && (
                  <p className="pt-2 font-serif italic text-amber-300 text-sm">
                    {effectiveSignoff}
                  </p>
                )}
              </div>
            </div>

            {/* Redeemable Love Coupons */}
            {coupons && coupons.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#ff4d5a]" />
                  <h4 className="font-bebas text-2xl tracking-wide text-white font-bold">
                    Exclusive Redeemable Coupons
                  </h4>
                </div>
                <p className="text-xs text-neutral-400">
                  Redeemable anytime by your girlfriend with zero expiration or objections!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                        coupon.redeemed
                          ? 'bg-neutral-900/40 border-neutral-800 opacity-60'
                          : 'bg-white/5 border-white/10 hover:border-[#E50914]/50 shadow-md'
                      }`}
                    >
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-white">
                            {coupon.title}
                          </h5>
                          {coupon.redeemed && (
                            <span className="text-[10px] font-bold text-neutral-400 bg-white/10 px-2 py-0.5 rounded">
                              REDEEMED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {coupon.perk}
                        </p>
                        <p className="text-[11px] text-neutral-500 italic">
                          Terms: {coupon.terms}
                        </p>
                      </div>

                      <button
                        disabled={coupon.redeemed}
                        onClick={() => handleRedeem(coupon.id)}
                        className={`w-full py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          coupon.redeemed
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-[#E50914] hover:bg-[#b80710] text-white active:scale-95 cursor-pointer shadow'
                        }`}
                      >
                        {coupon.redeemed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Claimed with Love</span>
                          </>
                        ) : (
                          <>
                            <Heart className="w-3.5 h-3.5 fill-white" />
                            <span>Redeem This Coupon</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
