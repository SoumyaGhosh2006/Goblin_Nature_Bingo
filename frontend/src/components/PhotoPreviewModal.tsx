/**
 * ============================================================================
 * PHOTO PREVIEW MODAL — GOBLIN NATURE BINGO
 * ============================================================================
 * Polaroid-style preview frame for the captured outdoor photo.
 * Lets the player review for blur or glare before sending to Grimble.
 */

import React from 'react';
import { RotateCcw, Send, Loader2 } from 'lucide-react';

interface PhotoPreviewModalProps {
  photoPreviewUrl: string;
  isVerifying: boolean;
  onRetake: () => void;
  onSubmit: () => void;
}

export const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  photoPreviewUrl,
  isVerifying,
  onRetake,
  onSubmit
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-[340px] bg-parchment-light border-4 border-timber-dark rounded-3xl p-4 shadow-2xl flex flex-col space-y-4">
        {/* Header Title */}
        <div className="text-center">
          <h3 className="text-lg font-black text-timber-dark">Inspect Your Forage</h3>
          <p className="text-xs font-semibold text-timber-light">Is the discovery crisp and clear?</p>
        </div>

        {/* Polaroid Image Frame */}
        <div className="w-full aspect-square bg-black rounded-2xl overflow-hidden border-2 border-timber shadow-inner relative">
          <img
            src={photoPreviewUrl}
            alt="Nature Scavenger Capture"
            className="w-full h-full object-cover"
          />

          {isVerifying && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-2 p-4 text-center">
              <Loader2 className="w-10 h-10 text-gold animate-spin" />
              <p className="text-sm font-black text-parchment">
                Grimble is sniffing the pixels...
              </p>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onRetake}
            disabled={isVerifying}
            className="py-3 btn-3d-timber flex items-center justify-center space-x-1.5 text-xs disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake</span>
          </button>

          <button
            onClick={onSubmit}
            disabled={isVerifying}
            className="py-3 btn-3d-action flex items-center justify-center space-x-1.5 text-xs disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Send to Grimble</span>
          </button>
        </div>
      </div>
    </div>
  );
};
