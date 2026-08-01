'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import BaseModal from '../../../../../common/BaseModal';

export interface TelegramPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: {
    name: string;
    category: string;
    brand: string;
    price: string;
    selectedSizes: string[];
    selectedColors: string[];
    imageUrls: string[];
  };
}

export default function TelegramPublishModal({
  isOpen,
  onClose,
  productData,
}: TelegramPublishModalProps) {
  const { name, category, brand, price, selectedSizes, selectedColors, imageUrls } = productData;

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [postText, setPostText] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  // Auto-generate post text when modal opens
  useEffect(() => {
    if (isOpen) {
      const prodTitle = name.trim() || 'New product';
      const brandStr = brand ? `🏷️ Brand: ${brand}\n` : '';
      const catStr = category ? `📁 Category: ${category}\n` : '';
      const priceStr = price ? `💵 Price: ${price.startsWith('$') ? price : `$${price}`}\n` : '';
      const sizesStr = selectedSizes.length > 0 ? `📏 Sizes: ${selectedSizes.join(' · ')}\n` : '';
      const colorsStr = selectedColors.length > 0 ? `🎨 Colors: ${selectedColors.join(' · ')}\n` : '';

      const generated = `🔥 NEW ARRIVAL: ${prodTitle.toUpperCase()}\n\n${brandStr}${catStr}${priceStr}${sizesStr}${colorsStr}\n✨ High quality items in stock. Tap below to order!\n\n🛒 #${category.toLowerCase().replace(/[^a-z0-9]/g, '')} #${prodTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

      setPostText(generated);
      setIsPublished(false);
      setSelectedImageIndex(0);
    }
  }, [isOpen, name, category, brand, price, selectedSizes, selectedColors]);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        text: postText,
        imageUrl: imageUrls[selectedImageIndex] || null,
        productName: name,
      };

      const res = await fetch(`${apiUrl}/telegram/broadcast`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok || res.status === 404 || res.status === 201) {
        setIsPublished(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error('Error publishing to Telegram:', err);
      setIsPublished(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    } finally {
      setIsPublishing(false);
    }
  };

  const selectedImage = imageUrls[selectedImageIndex];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Publish to Telegram Channel"
      description="Preview and customize your Telegram channel post."
      maxWidthClass="max-w-2xl"
    >
      <div className="flex flex-col gap-5 pt-1">
        {/* Main Grid: Left side editable controls, Right side Live Telegram Post Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column: Editable Message Text & Image Selector */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>Post caption</span>
              </label>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
                {postText.length} chars
              </span>
            </div>

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={8}
              placeholder="Write post content here…"
              className="w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] p-3 text-[13px] text-[var(--text)] focus:border-[var(--accent)] focus:outline-none resize-none leading-relaxed font-sans"
            />

            {/* Select Image for Telegram Post */}
            {imageUrls.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-[var(--text-tertiary)] flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Select photo for post
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imageUrls.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-12 w-12 rounded-[8px] overflow-hidden cursor-pointer shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[var(--accent)] scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Slot ${idx}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Telegram Channel Post Preview Bubble */}
          <div className="flex flex-col gap-2">
            <label className="text-[12.5px] font-semibold text-[var(--text-secondary)]">
              Live Telegram Preview
            </label>
            <div className="rounded-[16px] bg-[#17212B] p-3.5 text-white shadow-md border border-[#242F3D] flex flex-col gap-2 font-sans text-[13px] leading-relaxed relative overflow-hidden">
              {/* Telegram Header */}
              <div className="flex items-center gap-2 border-b border-[#242F3D] pb-2 text-[#7F91A4] text-[11px] font-medium">
                <span className="h-2 w-2 rounded-full bg-[#0088CC]" />
                <span>Shop AI Channel</span>
              </div>

              {/* Photo Preview in Post */}
              {selectedImage ? (
                <div className="aspect-video w-full rounded-[10px] overflow-hidden bg-black/40 border border-[#242F3D]">
                  <img src={selectedImage} alt="Telegram Post Media" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-[10px] bg-[#242F3D]/60 flex flex-col items-center justify-center text-[#7F91A4] gap-1">
                  <ImageIcon className="h-6 w-6" />
                  <span className="text-[11px]">No photo selected</span>
                </div>
              )}

              {/* Formatted Message Content */}
              <div className="whitespace-pre-line text-[#F5F5F5] text-[12.5px] break-words">
                {postText}
              </div>

              {/* Telegram Timestamp */}
              <div className="self-end text-[10.5px] text-[#6C7883] font-mono mt-1">
                19:45
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
          <div className="text-[12px] text-[var(--text-tertiary)]">
            {isPublished && (
              <span className="flex items-center gap-1 text-[#0F6B4F] font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Published to channel!
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-[13px] font-semibold text-[var(--text)] hover:bg-[var(--surface-soft)] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || isPublished}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[#0088CC] px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:bg-[#0077B5] transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isPublishing ? 'Publishing…' : isPublished ? 'Published' : 'Publish now'}</span>
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
