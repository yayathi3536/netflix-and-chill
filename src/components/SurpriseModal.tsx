import React, { useState, useEffect } from 'react';
import { X, Gift, Check, Clock, Mail } from 'lucide-react';

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

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  anniversaryDateStr = '2025-06-15',
  partner1 = 'Partner 1',
  partner2 = 'Partner 2',
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'coupons' | 'counter'>('letter');
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
      let start: number;
      if (!anniversaryDateStr) {
        start = new Date(2025, 5, 15, 0, 0, 0).getTime();
      } else if (anniversaryDateStr.includes('T')) {
        start = new Date(anniversaryDateStr).getTime();
      } else {
        const parts = anniversaryDateStr.split('-').map(Number);
        if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
          start = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0).getTime();
        } else {
          start = new Date(anniversaryDateStr).getTime();
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
      className="fixed inset-0 z-50 bg-[#000000]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full bg-[#141414] border border-[#181818] rounded shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded hover:bg-[#181818] text-[#808080] hover:text-[#FFFFFF] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#E50914] font-bold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5" />
            <span>ORIGINAL SPECIAL FEATURE</span>
          </div>
          <h2 className="font-bebas text-3xl sm:text-4xl text-[#FFFFFF] font-black uppercase tracking-wider">
            Private Vault & Notes
          </h2>
          <p className="text-xs text-[#B3B3B3] font-normal">
            {partner1} & {partner2} · Exclusively Streaming
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center">
          <div className="flex bg-[#181818] p-1 rounded border border-[#808080]/30 text-xs">
            <button
              onClick={() => setActiveTab('letter')}
              className={`px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'letter'
                  ? 'bg-[#E50914] text-[#FFFFFF] font-bold shadow'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Special Note</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'coupons'
                  ? 'bg-[#E50914] text-[#FFFFFF] font-bold shadow'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Coupons</span>
            </button>
            <button
              onClick={() => setActiveTab('counter')}
              className={`px-3.5 py-1.5 rounded font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'counter'
                  ? 'bg-[#E50914] text-[#FFFFFF] font-bold shadow'
                  : 'text-[#B3B3B3] hover:text-[#FFFFFF]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline Tracker</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LOVE LETTER */}
        {activeTab === 'letter' && (
          <div className="bg-[#181818] text-[#FFFFFF] rounded p-6 shadow-inner border border-[#808080]/30 space-y-4 max-h-[380px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#141414] pb-3">
              <span className="font-bebas text-2xl text-[#E50914] font-black uppercase tracking-wider">
                CONFIDENTIAL MEMO
              </span>
              <span className="text-xs bg-[#E50914] text-[#FFFFFF] px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                VERIFIED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
              They say the universe is expanding every single millisecond, but honestly, my whole world shrank to the warmest, safest size the day you walked into my life.
            </p>
            <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
              Looking back at where we started, every single step led us straight to each other. Thank you for loving me on the quiet days, laughing at my terrible jokes, and turning mundane moments into forever milestones.
            </p>
            <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed">
              You are my favorite plot twist, my safest sanctuary, and the only person I want to re-watch life with over and over again.
            </p>
            <div className="pt-2 text-right border-t border-[#141414]">
              <span className="font-bebas text-xl text-[#E50914] block uppercase tracking-wider">
                Always & Forever
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: LOVE COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {coupons.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 rounded border transition-all flex items-center justify-between gap-3 ${
                  c.isRedeemed
                    ? 'bg-[#181818]/40 border-[#181818] opacity-50'
                    : 'bg-[#181818] border-[#808080]/30 shadow'
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
                  className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                    c.isRedeemed
                      ? 'bg-[#141414] text-[#808080] border border-[#808080]/20'
                      : 'bg-[#E50914] hover:bg-[#b80710] text-[#FFFFFF] shadow active:scale-95'
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E50914]/15 border border-[#E50914]/40 text-[#E50914] text-xs font-semibold uppercase tracking-wider shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline Tracker · Since 15th June 2025</span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="p-3 sm:p-4 rounded bg-[#181818] border border-[#808080]/30">
                <span className="block font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-bold tabular-nums">
                  {timeTogether.days}
                </span>
                <span className="text-[10px] text-[#808080] uppercase tracking-widest font-semibold">
                  Days
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded bg-[#181818] border border-[#808080]/30">
                <span className="block font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-bold tabular-nums">
                  {timeTogether.hours}
                </span>
                <span className="text-[10px] text-[#808080] uppercase tracking-widest font-semibold">
                  Hours
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded bg-[#181818] border border-[#808080]/30">
                <span className="block font-bebas text-3xl sm:text-5xl text-[#FFFFFF] font-bold tabular-nums">
                  {timeTogether.minutes}
                </span>
                <span className="text-[10px] text-[#808080] uppercase tracking-widest font-semibold">
                  Mins
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded bg-[#181818] border border-[#808080]/30">
                <span className="block font-bebas text-3xl sm:text-5xl text-[#E50914] font-bold tabular-nums">
                  {timeTogether.seconds}
                </span>
                <span className="text-[10px] text-[#808080] uppercase tracking-widest font-semibold">
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
