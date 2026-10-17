import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Gift,
  CheckCircle2,
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
  const [isUnlocked, setIsUnlocked] = useState(!memory?.isSecret);
  const [errorMsg, setErrorMsg] = useState('');
  const [coupons, setCoupons] = useState<CouponItem[]>(memory?.coupons || []);

  React.useEffect(() => {
    if (memory) {
      setIsUnlocked(!memory.isSecret);
      setCoupons(memory.coupons || []);
      setPasscode('');
      setErrorMsg('');
    }
  }, [memory?.id, memory?.isSecret]);

  if (!memory) return null;

  const isPrimaryVaultLetter = memory.id === 'vault-1';
  const effectivePasscode = (customPasscode || memory.secretPasscode || '').trim();
  const effectiveTitle = isPrimaryVaultLetter
    ? customLetterTitle || memory.title || memory.subtitle || 'Confidential Memo'
    : memory.title || memory.subtitle || customLetterTitle || 'Confidential Memo';
  const effectiveSubtitle = isPrimaryVaultLetter
    ? customLetterSubtitle || memory.subtitle || 'Vault Unlocked · For Your Eyes Only'
    : memory.subtitle || customLetterSubtitle || 'Personal Love Note · For Your Eyes Only';
  const effectiveDate = isPrimaryVaultLetter
    ? customLetterDate || memory.date
    : memory.date || customLetterDate;
  const effectiveContent = isPrimaryVaultLetter
    ? customLetterContent || memory.letterContent || memory.fullStory
    : memory.letterContent || memory.fullStory || customLetterContent;
  const effectiveSignoff = customLetterSignoff;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectivePasscode && passcode.trim() === effectivePasscode) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect passcode. Please enter your authorized vault code.');
    }
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
      className="fixed inset-0 z-50 overflow-y-auto dark-scrollbar bg-[#000000]/85 backdrop-blur-md flex justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#141414] rounded overflow-hidden shadow-2xl border border-[#181818] my-auto text-[#FFFFFF] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 w-9 h-9 rounded-full bg-[#000000]/70 hover:bg-[#000000] text-[#FFFFFF] flex items-center justify-center transition-colors cursor-pointer border border-[#808080]/30"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          /* LOCKED STATE */
          <div className="text-center py-10 space-y-6 max-w-md mx-auto">
            <div className="w-16 h-16 rounded bg-[#181818] border border-[#E50914] flex items-center justify-center mx-auto text-[#E50914] shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#E50914] font-bold">
                CONFIDENTIAL VAULT EPISODE
              </span>
              <h2 className="font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-black tracking-wide mt-1 uppercase">
                {memory.title}
              </h2>
              <p className="text-xs text-[#B3B3B3] mt-2">
                This locked episode contains private personal letters and redeemable surprise coupons.
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
                  placeholder="Enter Vault Passcode"
                  className="w-full text-center text-lg tracking-widest font-mono bg-[#000000] border border-[#808080]/40 focus:border-[#E50914] rounded py-3 px-4 text-[#FFFFFF] placeholder-[#808080] focus:outline-none transition-colors"
                />
              </div>

              {errorMsg && <p className="text-xs text-[#E50914]">{errorMsg}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] font-bold text-sm rounded shadow transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Confidential Vault</span>
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED STATE: LETTER & COUPONS */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-[#181818] gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-[#E50914]" />
                <span className="text-xs uppercase tracking-widest text-[#FFFFFF] font-bold">
                  {effectiveSubtitle}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#808080]">{effectiveDate}</span>
                {isAdmin && onEditLetter && (
                  <button
                    onClick={onEditLetter}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#181818] hover:bg-white/10 text-[#FFFFFF] text-xs font-semibold rounded border border-[#808080]/30 transition-colors cursor-pointer"
                    title="Edit letter"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#E50914]" />
                    <span>Edit Letter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Letter View */}
            <div className="bg-[#181818] p-6 sm:p-8 rounded border border-[#808080]/30 space-y-4">
              <h3 className="font-bebas text-2xl tracking-wide text-[#FFFFFF] uppercase">
                {effectiveTitle}
              </h3>
              <div className="text-[#B3B3B3] text-sm sm:text-base leading-relaxed whitespace-pre-line font-light">
                {effectiveContent}
              </div>
              {effectiveSignoff && (
                <p className="pt-2 text-[#FFFFFF] font-semibold text-sm">
                  {effectiveSignoff}
                </p>
              )}
            </div>

            {/* Redeemable Coupons */}
            {coupons && coupons.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#181818]">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#E50914]" />
                  <h4 className="font-bebas text-2xl tracking-wide text-[#FFFFFF] font-black uppercase">
                    Redeemable Coupons
                  </h4>
                </div>
                <p className="text-xs text-[#808080]">
                  Available to redeem anytime with zero objections.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className={`p-4 rounded border transition-all flex flex-col justify-between ${
                        coupon.redeemed
                          ? 'bg-[#181818]/40 border-[#181818] opacity-50'
                          : 'bg-[#181818] border-[#808080]/30 shadow'
                      }`}
                    >
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-[#FFFFFF]">
                            {coupon.title}
                          </h5>
                          {coupon.redeemed && (
                            <span className="text-[10px] font-bold text-[#808080] bg-[#141414] px-2 py-0.5 rounded border border-[#808080]/20">
                              REDEEMED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#B3B3B3] leading-relaxed">
                          {coupon.perk}
                        </p>
                        <p className="text-[11px] text-[#808080]">
                          Terms: {coupon.terms}
                        </p>
                      </div>

                      <button
                        disabled={coupon.redeemed}
                        onClick={() => handleRedeem(coupon.id)}
                        className={`w-full py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                          coupon.redeemed
                            ? 'bg-[#141414] text-[#808080] cursor-not-allowed border border-[#808080]/20'
                            : 'bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] active:scale-95 cursor-pointer shadow'
                        }`}
                      >
                        {coupon.redeemed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B3B3B3]" />
                            <span>Claimed</span>
                          </>
                        ) : (
                          <span>Redeem Coupon</span>
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
