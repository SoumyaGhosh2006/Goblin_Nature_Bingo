/**
 * ============================================================================
 * INDEXEDDB STORAGE HOOK — OFFLINE PHOTO STASH & PENDING QUEUE
 * ============================================================================
 * Stores full camera photos as compressed binary blobs locally on the mobile
 * device, preventing memory exhaustion and enabling trail-mode pending queues.
 */

import { get, set, del, entries } from 'idb-keyval';
import type { PendingVerification } from '../types/game';

const PHOTO_PREFIX = 'photo_';
const QUEUE_PREFIX = 'pending_';

/**
 * Resizes an image via HTML5 Canvas to a maximum dimension of 1024px
 * and compresses it to JPEG quality 0.8 (<300KB) before saving or sending.
 */
export async function compressImage(file: File | Blob): Promise<{ blob: Blob; base64: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const maxDim = 1024;
      let width = img.width;
      let height = img.height;

      // Scale down proportionally
      if (width > height && width > maxDim) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else if (height > maxDim) {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const base64 = canvas.toDataURL('image/jpeg', 0.8);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, base64 });
          } else {
            reject(new Error('Canvas compression failed'));
          }
        },
        'image/jpeg',
        0.8
      );
    };

    img.onerror = reject;
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Saves a compressed photo blob to IndexedDB.
 */
export async function savePhotoBlob(photoId: string, blob: Blob): Promise<void> {
  await set(`${PHOTO_PREFIX}${photoId}`, blob);
}

/**
 * Retrieves a photo blob from IndexedDB.
 */
export async function getPhotoBlob(photoId: string): Promise<Blob | undefined> {
  return await get(`${PHOTO_PREFIX}${photoId}`);
}

/**
 * Stashes a verification attempt in the offline pending queue when trail signal drops.
 */
export async function queuePendingVerification(item: PendingVerification): Promise<void> {
  await set(`${QUEUE_PREFIX}${item.id}`, item);
}

/**
 * Returns all currently queued pending verifications for syncing.
 */
export async function getPendingVerifications(): Promise<PendingVerification[]> {
  const allEntries = await entries();
  return allEntries
    .filter(([key]) => typeof key === 'string' && key.startsWith(QUEUE_PREFIX))
    .map(([, val]) => val as PendingVerification);
}

/**
 * Removes a successfully synced verification from the pending queue.
 */
export async function removePendingVerification(id: string): Promise<void> {
  await del(`${QUEUE_PREFIX}${id}`);
}
