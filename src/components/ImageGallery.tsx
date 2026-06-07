"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  unitName: string;
}

const galleryImages = [
  "/images/gallery1.jpg",
  "/images/gallery2.jpg",
  "/images/gallery3.jpg",
  "/images/gallery4.jpg",
  "/images/gallery5.jpg",
];

export function ImageGallery({ images, unitName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      {/* Main image */}
      <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-gray-100">
        <Image
          src={galleryImages[activeIndex % galleryImages.length]}
          alt={`${unitName} photo ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority={activeIndex === 0}
        />

        {/* Nav arrows */}
        <button
          onClick={() =>
            setActiveIndex((activeIndex - 1 + images.length) % images.length)
          }
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white rounded w-9 h-9 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4 text-text" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white rounded w-9 h-9 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4 text-text" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Counter badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails — 80x64 per Figma */}
      <div className="flex gap-2 mt-2">
        {galleryImages.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-20 h-16 rounded overflow-hidden border-2 transition-colors ${
              i === activeIndex
                ? "border-primary"
                : "border-transparent hover:border-border"
            }`}
          >
            <Image
              src={src}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
