'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Plus } from 'lucide-react';

export interface ImageUploaderProps {
  imageUrls: string[];
  activeImageIndex: number;
  onImageUrlsChange: (urls: string[] | ((prev: string[]) => string[])) => void;
  onActiveIndexChange: (idx: number) => void;
}

export default function ImageUploader({
  imageUrls,
  activeImageIndex,
  onImageUrlsChange,
  onActiveIndexChange,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newUrls: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        newUrls.push(URL.createObjectURL(file));
      }
    });
    if (newUrls.length > 0) {
      onImageUrlsChange((prev) => [...prev, ...newUrls]);
      if (imageUrls.length === 0) {
        onActiveIndexChange(0);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onImageUrlsChange((prev) => {
      const next = prev.filter((_, idx) => idx !== indexToRemove);
      if (activeImageIndex >= next.length) {
        onActiveIndexChange(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="grid grid-cols-1 sm:grid-cols-[64px_1fr] gap-3">
        {/* Thumbs Sidebar */}
        <div className="flex sm:flex-col gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[0, 1, 2, 3].map((slotIdx) => {
            const hasImg = imageUrls[slotIdx];
            const isActive = activeImageIndex === slotIdx && hasImg;

            return (
              <div
                key={slotIdx}
                onClick={() => {
                  if (hasImg) {
                    onActiveIndexChange(slotIdx);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className={`relative h-[60px] w-[60px] rounded-[10px] bg-[var(--surface-sunken)] shrink-0 cursor-pointer overflow-hidden transition-all ${
                  isActive
                    ? 'border-2 border-[var(--accent)]'
                    : 'border border-transparent hover:border-[var(--border-strong)]'
                }`}
              >
                {hasImg ? (
                  <>
                    <img
                      src={hasImg}
                      alt={`Thumb ${slotIdx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(slotIdx);
                      }}
                      className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[10px] text-white hover:bg-black"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[var(--text-tertiary)] hover:text-[var(--text)]">
                    <Plus className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Hero Image Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative aspect-square w-full rounded-[14px] flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden transition-all duration-200 ${
            isDragging
              ? 'border-2 border-dashed border-[var(--accent)] bg-[var(--accent-soft)]'
              : imageUrls.length > 0
              ? 'border border-[var(--border)] bg-black/5'
              : 'bg-gradient-to-br from-[#F1EEE6] to-[#E4DFD2] hover:opacity-95'
          }`}
        >
          {imageUrls.length > 0 ? (
            <>
              <img
                src={imageUrls[activeImageIndex] || imageUrls[0]}
                alt="Product main"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white font-medium text-[13px]">
                <Upload className="h-5 w-5" />
                <span>Click or drag to add more images</span>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-[var(--text-tertiary)]" strokeWidth={1.5} />
              <span className="text-[12px] font-medium text-[var(--text-secondary)] flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" /> Upload images
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)]">
                {isDragging ? 'Drop images here...' : 'Click or drag & drop files here'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
