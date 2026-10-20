import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Eye,
  Calendar,
  MapPin,
  Upload,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { PrototypePhoto } from './types';

interface PhotoGalleryTabProps {
  photos: PrototypePhoto[];
  onSavePhoto: (photo: PrototypePhoto) => void;
  onRequestDeletePhoto: (id: string, title: string) => void;
}

export const PhotoGalleryTab: React.FC<PhotoGalleryTabProps> = ({
  photos,
  onSavePhoto,
  onRequestDeletePhoto,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<PrototypePhoto | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<PrototypePhoto['category']>('trips');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'trips', label: 'Trips & Escapes' },
    { id: 'celebrations', label: 'Celebrations' },
    { id: 'candid', label: 'Candid Moments' },
    { id: 'milestones', label: 'Milestones & Vault' },
  ];

  const handleOpenAdd = () => {
    setEditingPhotoId(null);
    setTitle('');
    setCaption('');
    setCategory('trips');
    setDate(new Date().toISOString().slice(0, 10));
    setLocation('');
    setUrl(
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80'
    );
    setLocalPreview(null);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (photo: PrototypePhoto) => {
    setEditingPhotoId(photo.id);
    setTitle(photo.title);
    setCaption(photo.caption || '');
    setCategory(photo.category);
    setDate(photo.date);
    setLocation(photo.location || '');
    setUrl(photo.url);
    setLocalPreview(photo.url);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setLocalPreview(blobUrl);
      setUrl(blobUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a photo title');
      return;
    }
    if (!url.trim()) {
      setErrorMsg('Please provide an image URL or choose a local photo file');
      return;
    }

    const item: PrototypePhoto = {
      id: editingPhotoId || `photo-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim() || undefined,
      category,
      date,
      location: location.trim() || undefined,
      url: url.trim(),
      createdAt: new Date().toISOString(),
    };

    onSavePhoto(item);
    setIsModalOpen(false);
  };

  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.caption && p.caption.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Photo Gallery Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Curate high-resolution snapshots, candid laughter, and vacation memories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b81d24] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#E50914]/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#161616] border border-white/10 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photos by title, caption, location..."
            className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 pl-10 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto dark-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#E50914] text-white font-bold shadow-md shadow-[#E50914]/20'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl border border-dashed border-white/15 bg-white/5 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-neutral-500" />
          <h3 className="text-base font-bold text-white">No photos found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Add your first photograph using local file selection or direct image links.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E50914] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl overflow-hidden bg-[#161616] border border-white/10 hover:border-white/30 transition-all flex flex-col shadow-lg"
            >
              {/* Photo Box */}
              <div
                onClick={() => setPreviewPhoto(photo)}
                className="relative aspect-square w-full overflow-hidden bg-black cursor-pointer"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="truncate pr-1 font-semibold">{photo.title}</span>
                  <Eye className="w-3.5 h-3.5 text-[#E50914] shrink-0" />
                </div>
              </div>

              {/* Photo Metadata Footer */}
              <div className="p-3 bg-[#161616] flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <span className="block text-white font-semibold truncate text-[11px]">
                    {photo.title}
                  </span>
                  <span className="block text-[10px] text-neutral-400 capitalize">
                    {photo.category} • {photo.date}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(photo)}
                    className="p-1 text-neutral-400 hover:text-white rounded hover:bg-white/10"
                    title="Edit metadata"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRequestDeletePhoto(photo.id, photo.title)}
                    className="p-1 text-neutral-400 hover:text-[#E50914] rounded hover:bg-[#E50914]/10"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
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
              {editingPhotoId ? 'Edit Photo Details' : 'Add New Photo'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Select an image from your computer for local browser preview or paste an image URL.
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
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="e.g. Golden Sunset at the Pier"
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Image Source (Choose file or paste URL) *
                </label>
                <div className="space-y-2">
                  <label className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 hover:border-[#E50914] bg-[#111111] hover:bg-white/5 cursor-pointer text-xs text-neutral-300 transition-colors">
                    <Upload className="w-4 h-4 text-[#E50914]" />
                    <span>Choose Local Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setLocalPreview(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>

                {localPreview && (
                  <div className="mt-2.5 relative aspect-video rounded-lg overflow-hidden border border-white/15 bg-black">
                    <img
                      src={localPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as PrototypePhoto['category'])
                    }
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="trips">Trips & Escapes</option>
                    <option value="celebrations">Celebrations</option>
                    <option value="candid">Candid Moments</option>
                    <option value="milestones">Milestones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Santa Monica Boardwalk"
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Caption / Story Note (optional)
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="The moment the sky turned into melted peach candy..."
                  className="w-full bg-[#111111] border border-white/15 focus:border-[#E50914] rounded-lg p-2.5 text-xs text-white focus:outline-none"
                />
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
                  {editingPhotoId ? 'Save Metadata' : 'Add to Prototype'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX PHOTO PREVIEW MODAL */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#161616] border border-white/15 rounded-2xl overflow-hidden shadow-2xl text-white my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video max-h-[60vh] bg-black overflow-hidden flex items-center justify-center">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 space-y-2 bg-[#121212]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{previewPhoto.title}</h3>
                <span className="text-xs text-[#E50914] font-semibold capitalize px-2 py-0.5 rounded bg-[#E50914]/10 border border-[#E50914]/20">
                  {previewPhoto.category}
                </span>
              </div>
              {previewPhoto.caption && (
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {previewPhoto.caption}
                </p>
              )}
              <div className="pt-2 flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E50914]" /> {previewPhoto.date}
                </span>
                {previewPhoto.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E50914]" /> {previewPhoto.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
