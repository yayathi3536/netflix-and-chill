import { MemoryItem, Episode } from '../types';

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

/**
 * Checks if a given string is a genuine video URL or data URI.
 */
export function isVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('data:video/') || trimmed.startsWith('blob:')) return true;
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const parsed = new URL(trimmed);
      if (VIDEO_EXTENSIONS.test(parsed.pathname)) return true;
    }
  } catch {
    // continue to regex test
  }
  return VIDEO_EXTENSIONS.test(trimmed);
}

/**
 * Checks if a given string is a valid image URL or data URI (and not a video).
 */
export function isImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (isVideoUrl(trimmed)) return false;
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('/')
  );
}

/**
 * Returns the valid video source URL for a memory or episode, or null if none exists.
 */
export function getVideoUrl(memory?: MemoryItem | null, episode?: Episode | null): string | null {
  if (!memory) return null;

  if (episode) {
    if (isVideoUrl(episode.videoUrl)) return episode.videoUrl!.trim();
    if (isVideoUrl(episode.thumbnailUrl)) return episode.thumbnailUrl!.trim();
  }

  if (isVideoUrl(memory.videoUrl)) return memory.videoUrl!.trim();
  if (isVideoUrl(memory.backdropUrl)) return memory.backdropUrl!.trim();
  if (isVideoUrl(memory.posterUrl)) return memory.posterUrl!.trim();

  return null;
}

/**
 * Returns true ONLY if the memory (or episode) has a genuine, playable video source.
 */
export function hasValidVideo(memory?: MemoryItem | null, episode?: Episode | null): boolean {
  return getVideoUrl(memory, episode) !== null;
}

/**
 * Returns true if the item is a letter, love note, or secret vault entry.
 */
export function isLetterItem(memory?: MemoryItem | null): boolean {
  if (!memory) return false;
  return (
    memory.category === 'secret-vault' ||
    Boolean(memory.isSecret) ||
    Boolean(memory.letterContent && memory.letterContent.trim().length > 0)
  );
}

export interface PhotoGalleryEntry {
  url?: string;
  caption: string;
}

/**
 * Extracts all viewable photo / still entries for a memory item.
 */
export function getPhotoEntries(memory?: MemoryItem | null): PhotoGalleryEntry[] {
  if (!memory) return [];
  const entries: PhotoGalleryEntry[] = [];
  const seenUrls = new Set<string>();

  if (isImageUrl(memory.backdropUrl)) {
    const url = memory.backdropUrl!.trim();
    seenUrls.add(url);
    entries.push({ url, caption: memory.title });
  }

  if (isImageUrl(memory.posterUrl)) {
    const url = memory.posterUrl!.trim();
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      entries.push({ url, caption: `${memory.title} (Poster)` });
    }
  }

  if (Array.isArray(memory.photos)) {
    memory.photos.forEach((photo, idx) => {
      if (!photo || typeof photo !== 'string') return;
      const trimmed = photo.trim();
      if (!trimmed) return;
      if (isImageUrl(trimmed)) {
        if (!seenUrls.has(trimmed)) {
          seenUrls.add(trimmed);
          entries.push({ url: trimmed, caption: `${memory.title} — Photo ${idx + 1}` });
        }
      } else {
        entries.push({
          url: isImageUrl(memory.backdropUrl)
            ? memory.backdropUrl
            : isImageUrl(memory.posterUrl)
            ? memory.posterUrl
            : undefined,
          caption: trimmed,
        });
      }
    });
  }

  return entries;
}

/**
 * Returns true if the item has associated photos or image URLs.
 */
export function hasPhotos(memory?: MemoryItem | null): boolean {
  if (!memory) return false;
  return getPhotoEntries(memory).length > 0;
}

/**
 * Resolves the most appropriate image URL for a memory item based on the target display layout.
 * For landscape: prioritizes backdropUrl, then posterUrl, then first valid item in photos array.
 * For poster: prioritizes posterUrl, then backdropUrl, then first valid item in photos array.
 */
export function getMemoryImageUrl(
  memory?: MemoryItem | null,
  targetLayout: 'landscape' | 'poster' = 'landscape'
): string | undefined {
  if (!memory) return undefined;

  if (targetLayout === 'poster') {
    if (isImageUrl(memory.posterUrl)) return memory.posterUrl!.trim();
    if (isImageUrl(memory.backdropUrl)) return memory.backdropUrl!.trim();
  } else {
    if (isImageUrl(memory.backdropUrl)) return memory.backdropUrl!.trim();
    if (isImageUrl(memory.posterUrl)) return memory.posterUrl!.trim();
  }

  // Check additional photos array
  if (Array.isArray(memory.photos) && memory.photos.length > 0) {
    const firstValid = memory.photos.find((p) => typeof p === 'string' && isImageUrl(p));
    if (firstValid) return firstValid.trim();
  }

  // Direct string fallback if isImageUrl check was too strict
  if (targetLayout === 'poster') {
    const candidate = memory.posterUrl?.trim() || memory.backdropUrl?.trim();
    if (candidate && !isVideoUrl(candidate)) return candidate;
  } else {
    const candidate = memory.backdropUrl?.trim() || memory.posterUrl?.trim();
    if (candidate && !isVideoUrl(candidate)) return candidate;
  }

  return undefined;
}

