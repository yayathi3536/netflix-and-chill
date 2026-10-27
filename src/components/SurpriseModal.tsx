import React, { useState, useEffect } from 'react';
import { X, Gift, Check, Clock } from 'lucide-react';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  anniversaryDateStr?: string;
  partner1?: string;
  partner2?: string;
}

interface Coupon {
  id: string;
  title: string;
  description: string;
  isRedeemed: boolean;
  emoji: string;
}

export const EARLIEST_TIMELINE_DATE = '2025-06-15';

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  anniversaryDateStr = EARLIEST_TIMELINE_DATE,
  partner1 = 'Partner 1',
  partner2 = 'Partner 2',
}) => {
  const [activeTab, setActiveTab] = useState<'coupons' | 'counter'>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 'c1',
      title: 'Midnight Snack Run',
      description: 'Redeemable anytime for your favorite treat, no questions asked.',
      isRedeemed: false,
      emoji: '🍨',
    },
    {
      id: 'c2',
      title: 'Relaxing Massage Session',
      description: '30 minutes of complete relaxation and quiet comfort.',
      isRedeemed: false,
      emoji: '💆‍♀️',
    },
    {
      id: 'c3',
      title: 'Movie Night Veto Pass',
      description: 'You pick the movie, grab the snacks, and I will gladly watch.',
      isRedeemed: true,
      emoji: '🎬',
    },
    {
      id: 'c4',
      title: 'Spontaneous Day Trip',
      description: 'Pack a small bag. We get in the car and explore somewhere peaceful.',
      isRedeemed: false,
      emoji: '🚗',
    },
    {
      id: 'c5',
      title: 'One Unlimited Wish',
      description: 'Whatever your heart desires, granted with all my love.',
      isRedeemed: false,
      emoji: '✨',
    },
  ]);

  // Days together live calculator
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      // Enforce lower bound: earliest displayed date is 15 June 2025, inclusive
      const effectiveDateStr =
        !anniversaryDateStr || anniversaryDateStr < EARLIEST_TIMELINE_DATE
          ? EARLIEST_TIMELINE_DATE
          : anniversaryDateStr;

      let start: number;
      if (effectiveDateStr.includes('T')) {
        start = new Date(effectiveDateStr).getTime();
      } else {
        const parts = effectiveDateStr.split('-').map(Number);
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          start = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0).getTime();
        } else {
          start = new Date(effectiveDateStr).getTime();
        }
      }

      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeTogether({ days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [anniversaryDateStr]);

  const handleRedeem = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isRedeemed: !c.isRedeemed } : c))
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#000000]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full bg-[#141414] border border-white/10 rounded-2xl netflix-modal-shadow p-5 sm:p-8 space-y-5 sm:space-y-6 my-auto max-h-[92vh] overflow-y-auto dark-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 rounded-full bg-[#181818] hover:bg-black text-[#808080] hover:text-[#FFFFFF] transition-all cursor-pointer flex items-center justify-center min-h-[40px] min-w-[40px] border border-white/10 hover:border-white/20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1 pr-6 pl-6">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#808080] font-bold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" />
            <span>ORIGINAL SPECIAL FEATURE</span>
          </div>
          <h2 className="font-bebas text-2xl sm:text-4xl text-[#FFFFFF] font-black uppercase tracking-wider">
            Private Vault & Notes
          </h2>
          <p className="text-xs text-[#B3B3B3] font-normal">
            {partner1} & {partner2} · Exclusively Streaming
          </p>
        </div>

        {/* Tab Buttons (Segmented Control) */}
        <div className="flex justify-center w-full overflow-x-auto no-scrollbar py-0.5">
          <div className="inline-flex bg-neutral-900 p-1 rounded-md border border-white/10 text-xs shrink-0 gap-1">
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 min-h-[38px] text-[11px] sm:text-xs whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-white/5'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Coupons</span>
            </button>
            <button
              onClick={() => setActiveTab('counter')}
              className={`px-3 sm:px-4 py-2 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 min-h-[38px] text-[11px] sm:text-xs whitespace-nowrap ${
                activeTab === 'counter'
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF] hover:bg-white/5'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline Tracker</span>
            </button>
          </div>
        </div>

        {/* TAB 2: LOVE COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {coupons.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 rounded-md border transition-all flex items-center justify-between gap-3 ${
                  c.isRedeemed
                    ? 'bg-neutral-900/50 border-white/5 opacity-50'
                    : 'bg-neutral-900 border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-2xl">{c.emoji}</span>
                  <div>
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        c.isRedeemed ? 'line-through text-[#808080]' : 'text-[#FFFFFF]'
                      }`}
                    >
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-[#B3B3B3]">{c.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleRedeem(c.id)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                    c.isRedeemed
                      ? 'bg-[#141414] text-[#808080] border border-white/10'
                       : 'bg-white hover:bg-white/80 text-black shadow-sm active:scale-95'
                  }`}
                >
                  {c.isRedeemed ? 'Claimed ✓' : 'Redeem'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DAYS TOGETHER COUNTER */}
        {activeTab === 'counter' && (
          <div className="space-y-6 text-center py-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#808080]/15 border border-[#808080]/40 text-[#808080] text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline Tracker · Since 15th June 2025</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
              <div className="p-2 sm:p-4 rounded-md bg-neutral-900 border border-white/10">
                <span className="block font-bebas text-2xl xs:text-3xl sm:text-5xl text-[#FFFFFF] font-bold tabular-nums">
                  {timeTogether.days}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#808080] uppercase tracking-wider sm:tracking-widest font-semibold">
                  Days
                </span>
              </div>
              <div className="p-2 sm:p-4 rounded-md bg-neutral-900 border border-white/10">
                <span className="block font-bebas text-2xl xs:text-3xl sm:text-5xl text-[#FFFFFF] font-bold tabular-nums">
                  {timeTogether.hours}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#808080] uppercase tracking-wider sm:tracking-widest font-semibold">
                  Hours
                </span>
              </div>
              <div className="p-2 sm:p-4 rounded-md bg-neutral-900 border border-white/10">
                <span className="block font-bebas text-2xl xs:text-3xl sm:text-5xl text-[#FFFFFF] font-bold tabular-nums">
                  {timeTogether.minutes}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#808080] uppercase tracking-wider sm:tracking-widest font-semibold">
                  Mins
                </span>
              </div>
              <div className="p-2 sm:p-4 rounded-md bg-neutral-900 border border-white/10">
                <span className="block font-bebas text-2xl xs:text-3xl sm:text-5xl text-white font-bold tabular-nums">
                  {timeTogether.seconds}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#808080] uppercase tracking-wider sm:tracking-widest font-semibold">
                  Secs
                </span>
              </div>
            </div>

            <p className="text-xs text-[#B3B3B3]">
              "And I would choose you in every single lifetime, across every galaxy."
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
