import React, { useState } from 'react';
import {
  Ticket,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Sparkles,
  Calendar,
  X,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { PrototypeCoupon } from './types';

interface CouponsTabProps {
  coupons: PrototypeCoupon[];
  onSaveCoupon: (coupon: PrototypeCoupon) => void;
  onToggleCouponStatus: (id: string) => void;
  onRequestDeleteCoupon: (id: string, title: string) => void;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({
  coupons,
  onSaveCoupon,
  onToggleCouponStatus,
  onRequestDeleteCoupon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'redeemed'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [terms, setTerms] = useState('');
  const [validUntil, setValidUntil] = useState('Forever');
  const [status, setStatus] = useState<PrototypeCoupon['status']>('active');
  const [category, setCategory] = useState<PrototypeCoupon['category']>('romance');
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setTerms('Valid anytime. No expiration date.');
    setValidUntil('Forever');
    setStatus('active');
    setCategory('romance');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon: PrototypeCoupon) => {
    setEditingId(coupon.id);
    setTitle(coupon.title);
    setDescription(coupon.description);
    setTerms(coupon.terms);
    setValidUntil(coupon.validUntil);
    setStatus(coupon.status);
    setCategory(coupon.category);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Coupon title is required');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Coupon description / perk is required');
      return;
    }

    const item: PrototypeCoupon = {
      id: editingId || `cp-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      terms: terms.trim() || 'Valid anytime',
      validUntil: validUntil.trim() || 'Forever',
      status,
      category,
      createdAt: new Date().toISOString(),
    };

    onSaveCoupon(item);
    setIsModalOpen(false);
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Love & Date Coupons
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Create redeemable vouchers, breakfast in bed treats, and fun perks.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#161616] border border-white/10 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupons by title or perk..."
            className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {(['all', 'active', 'redeemed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-white text-black'
                  : 'bg-[#111111] text-neutral-400 hover:text-white border border-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      {filteredCoupons.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-white/15 bg-white/5 space-y-3">
          <Ticket className="w-12 h-12 mx-auto text-neutral-500" />
          <h3 className="text-base font-bold text-white">No coupons found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Create a sweet coupon or date voucher to surprise your partner.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all shadow-xl ${
                coupon.status === 'redeemed'
                  ? 'bg-[#121212] border-white/5 opacity-60'
                  : 'bg-gradient-to-br from-[#1a1314] via-[#161616] to-[#141414] border-white/10 hover:border-[#E50914]/40 hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      coupon.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}
                  >
                    {coupon.status === 'active' ? 'Active' : 'Redeemed'}
                  </span>

                  <span className="text-[10px] text-neutral-400 font-mono">
                    VALID: {coupon.validUntil}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] shrink-0 mt-0.5">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white line-clamp-1">
                      {coupon.title}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      {coupon.description}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-2 italic">
                      {coupon.terms}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleCouponStatus(coupon.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    coupon.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/15'
                  }`}
                >
                  {coupon.status === 'active' ? 'Mark Redeemed' : 'Reactivate'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(coupon)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
                    title="Edit coupon"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRequestDeleteCoupon(coupon.id, coupon.title)}
                    className="p-1.5 text-neutral-400 hover:text-[#E50914] rounded-lg hover:bg-[#E50914]/10"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT COUPON MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#161616] border border-white/15 rounded-xl shadow-2xl p-6 text-white my-auto max-h-[92vh] overflow-y-auto dark-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white tracking-wide">
              {editingId ? 'Edit Love Coupon' : 'Create Love Coupon'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Add a delightful date night voucher or perk to the prototype.
            </p>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-lg bg-[#E50914]/15 border border-[#E50914] text-xs text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Coupon Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. Late Night Ice Cream Run"
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2.5 px-3.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Perk Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="Describe what this coupon entitles your partner to..."
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Terms & Conditions
                </label>
                <input
                  type="text"
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="e.g. Valid 24/7. Pajamas acceptable attire."
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Valid Until / Expiration
                  </label>
                  <input
                    type="text"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    placeholder="Forever"
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as PrototypeCoupon['category'])
                    }
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="romance">Romance</option>
                    <option value="adventure">Adventure</option>
                    <option value="chill">Chill & Cozy</option>
                    <option value="food">Food & Treats</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#E50914]/30 cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
